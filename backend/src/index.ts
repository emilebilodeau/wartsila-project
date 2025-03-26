import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import surveyRoutes from "./routes/survey.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.use(surveyRoutes);

app.get("/", (_req, res) => {
  res.send("Survey API is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
