
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Notes API Running...");
});

app.use("/api/notes", noteRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
