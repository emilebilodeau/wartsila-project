import express from "express";
import { db } from "../db";

const router = express.Router();

// create survey endpoint
// TODO: come back and fix type assignment later, spefically for res
router.post("/api/surveys", async (req: any, res: any) => {
  const { title, questions } = req.body;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Invalid survey payload" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert the survey
    const [surveyResult] = await connection.query(
      `INSERT INTO surveys (title, created_at) VALUES (?, NOW())`,
      [title]
    );
    const surveyId = (surveyResult as any).insertId;

    // 2. Insert each question
    const questionInsertPromises = questions.map((q, index) =>
      connection.query(
        `INSERT INTO questions (survey_id, type, prompt, min, max, question_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          surveyId,
          q.type,
          q.question,
          q.type === "linear" ? q.min : null,
          q.type === "linear" ? q.max : null,
          index + 1,
        ]
      )
    );

    await Promise.all(questionInsertPromises);

    await connection.commit();
    res.status(201).json({ message: "Survey created", surveyId });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating survey:", error);
    res.status(500).json({ error: "Failed to create survey" });
  } finally {
    connection.release();
  }
});

// get survey from homepage
router.get("/api/surveys", async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT id, title, created_at
        FROM surveys
        ORDER BY created_at DESC
      `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching surveys:", err);
    res.status(500).json({ error: "Failed to fetch surveys" });
  }
});

// TODO: when user is implemented, update the query
// const userId = req.user.id;

// const [rows] = await db.query(`
//   SELECT id, title, created_at
//   FROM surveys
//   WHERE created_by = ?
//   ORDER BY created_at DESC
// `, [userId]);

export default router;
