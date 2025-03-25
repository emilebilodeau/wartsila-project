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

// delete survey on homepage
router.delete("/api/surveys/:id", async (req, res: any) => {
  const surveyId = parseInt(req.params.id);

  if (isNaN(surveyId)) {
    return res.status(400).json({ error: "Invalid survey ID" });
  }

  try {
    const [result] = await db.query(`DELETE FROM surveys WHERE id = ?`, [
      surveyId,
    ]);

    const affected = (result as any).affectedRows;
    if (affected === 0) {
      return res.status(404).json({ error: "Survey not found" });
    }

    res.json({ message: "Survey deleted successfully" });
  } catch (err) {
    console.error("Error deleting survey:", err);
    res.status(500).json({ error: "Failed to delete survey" });
  }
});

// get questions so they can be answered on form page
router.get("/api/surveys/:id/questions", async (req, res: any) => {
  const surveyId = parseInt(req.params.id);

  if (isNaN(surveyId)) {
    return res.status(400).json({ error: "Invalid survey ID" });
  }

  try {
    // TODO: will need to fix the naming convention for question/prompt
    // quick fix: prompt AS question, should be changed
    const [questions] = await db.query(
      `SELECT id, type, prompt AS question, min, max
         FROM questions
         WHERE survey_id = ?
         ORDER BY question_order ASC`,
      [surveyId]
    );

    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch survey questions" });
  }
});

// submit answer endpoint for a form
router.post("/api/responses", async (req, res: any) => {
  const { survey_id, answers } = req.body;

  if (!survey_id || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Invalid response payload" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Create a new response
    const [responseResult] = await connection.query(
      `INSERT INTO responses (survey_id, responded_at) VALUES (?, NOW())`,
      [survey_id]
    );
    const responseId = (responseResult as any).insertId;

    // 2. Insert answers
    const answerInsertPromises = answers.map((ans: any) =>
      connection.query(
        `INSERT INTO answers (response_id, question_id, answer_text, created_at)
           VALUES (?, ?, ?, NOW())`,
        [
          responseId,
          ans.question_id,
          String(ans.answer), // store all answers as strings for now
        ]
      )
    );

    await Promise.all(answerInsertPromises);

    await connection.commit();
    res
      .status(201)
      .json({ message: "Response saved", response_id: responseId });
  } catch (err) {
    await connection.rollback();
    console.error("Error saving survey response:", err);
    res.status(500).json({ error: "Failed to save survey response" });
  } finally {
    connection.release();
  }
});

export default router;
