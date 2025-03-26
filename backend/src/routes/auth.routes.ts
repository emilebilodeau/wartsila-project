import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { createSecretKey } from "crypto";
import express from "express";
import { db } from "../db";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

// endpoint to register a user
router.post("/api/register", async (req, res: any) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Email and password required (min 6 characters)." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(`INSERT INTO users (email, password) VALUES (?, ?)`, [
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully." });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already in use." });
    }
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

router.post("/api/login", async (req, res: any) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT id, password FROM users WHERE email = ?`,
      [email]
    );
    const user = (rows as any)[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // this was tough to fix: jsonwebtoken@9.x.x requires some very
    // specific types for sign(). needed to import crypto to get
    // KeyObject as well as SignOptions.

    // jsonwebtoken@8.x.x has string support for secrets, but i
    // decided to go with the newer version
    const token = jwt.sign(
      { user_id: user.id },
      createSecretKey(Buffer.from(process.env.JWT_SECRET!, "utf-8")),
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      } as SignOptions
    );

    // NOTE: we can type the payload as well:
    // const payload = { user_id: user.id };
    // const options: SignOptions = {
    //   expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    // };

    // const token = jwt.sign(
    //   payload,
    //   createSecretKey(Buffer.from(process.env.JWT_SECRET!, "utf-8")),
    //   options
    // );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

export default router;
