import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#f7f7f5",
    },
    imageData: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);
