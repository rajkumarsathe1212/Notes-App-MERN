
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    content: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
