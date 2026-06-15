
import express from "express";

import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getTags,
  togglePinNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.get("/", getNotes);

router.get("/search", searchNotes);

router.get("/tags", getTags);

router.get("/:id", getNoteById);

router.post("/", createNote);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

router.patch("/:id/pin", togglePinNote);

export default router;
