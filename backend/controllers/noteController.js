
import Note from "../models/Note.js";
import { sendSuccess } from "../utils/response.js";
import ApiError from "../utils/apiError.js";

const normalizeTags = (tags = []) =>
  Array.isArray(tags)
    ? [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))]
    : [];

const normalizeContent = (content, fallback = "") =>
  typeof content === "string"
    ? content.trim()
    : content ?? fallback;

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSortedNotes = () =>
  Note.find({}, "-__v").sort({ isPinned: -1, updatedAt: -1 });

// GET ALL NOTES
export const getNotes = async (req, res, next) => {
  try {
    const notes = await getSortedNotes();

    sendSuccess(res, 200,  "Notes fetched successfully", notes);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE NOTE
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).select("-__v");

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    sendSuccess(res, 200, "Note fetched successfully", note);
  } catch (error) {
    next(error);
  }
};

// CREATE NOTE
export const createNote = async (req, res, next) => {
  try {
    const { title, content, tags = [], isPinned = false } = req.body;

    if (!title || title.trim() === "") {
      throw new ApiError(400, "Title is required");
    }

    const note = await Note.create({
      title: title.trim(),
      content: normalizeContent(content),
      tags: normalizeTags(tags),
      isPinned: Boolean(isPinned),
    });

    sendSuccess(res, 201, "Note created successfully", note);
  } catch (error) {
    next(error);
  }
};

// UPDATE NOTE
export const updateNote = async (req, res, next) => {
  try {
    const { title, content, tags, isPinned } = req.body;

    if (!title || title.trim() === "") {
      throw new ApiError(400, "Title is required");
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    note.title = title.trim();
    if (content !== undefined) {
      note.content = normalizeContent(content, note.content);
    }
    if (tags !== undefined) {
      note.tags = normalizeTags(tags);
    }
    if (isPinned !== undefined) {
      note.isPinned = Boolean(isPinned);
    }

    const updated = await note.save();

    sendSuccess(res, 200, "Note updated successfully", updated);
  } catch (error) {
    next(error);
  }
};

// DELETE NOTE
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    await note.deleteOne();

    sendSuccess(res, 200, "Note deleted successfully");
  } catch (error) {
    next(error);
  }
};

// SEARCH NOTES
export const searchNotes = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      const notes = await getSortedNotes();
      return sendSuccess(res, 200, "Search completed successfully", notes);
    }

    const notes = await Note.find({
      $or: [
        {
          title: {
            $regex: escapeRegExp(q),
            $options: "i",
          },
        },
        {
          content: {
            $regex: escapeRegExp(q),
            $options: "i",
          },
        },
      ],
    }, "-__v").sort({ isPinned: -1, updatedAt: -1 });

    sendSuccess(res, 200, "Search completed successfully", notes);
  } catch (error) {
    next(error);
  }
};

// GET ALL UNIQUE TAGS
export const getTags = async (req, res, next) => {
  try {
    const tags = await Note.distinct("tags");
    sendSuccess(res, 200, "Tags fetched successfully", tags.sort());
  } catch (error) {
    next(error);
  }
};

// TOGGLE PIN STATE
export const togglePinNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).select("-__v");

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    note.isPinned = !note.isPinned;
    const updated = await note.save();

    sendSuccess(
      res,
      200,
      `Note ${updated.isPinned ? "pinned" : "unpinned"} successfully`,
      updated
    );
  } catch (error) {
    next(error);
  }
};
