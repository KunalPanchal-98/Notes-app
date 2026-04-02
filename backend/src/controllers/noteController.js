import Note from "../models/Note.js";

export const getNotes = async (_req, res, next) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content, color, imageData } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }
    const note = await Note.create({
      title: title.trim(),
      content: content?.trim() || "",
      color: color || "#f7f7f5",
      imageData: imageData || null,
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, color, imageData } = req.body;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found." });

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;
    if (imageData !== undefined) note.imageData = imageData;

    await note.save();
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Note not found." });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
