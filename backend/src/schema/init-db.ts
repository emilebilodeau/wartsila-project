import { db } from "../db";

async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS surveys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_by INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT NOT NULL,
        type ENUM('text', 'number', 'yesno', 'linear') NOT NULL,
        prompt TEXT NOT NULL,
        min INT,
        max INT,
        question_order INT,
        FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT NOT NULL,
        user_id INT,
        responded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        response_id INT NOT NULL,
        question_id INT NOT NULL,
        answer_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      );
    `);

    console.log("All tables created successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error creating tables:", err);
    process.exit(1);
  }
}

initDB();
