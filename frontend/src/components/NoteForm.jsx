import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MicIcon, ImageIcon, SparklesIcon } from "./icons.jsx";
import { useSpeechToText } from "../hooks/useSpeechToText.js";

const emptyForm = {
  title: "",
  content: "",
  color: "#f7f7f5",
  imageData: null,
};

const NoteForm = ({ palette, onCreate, summarizer }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const { listening, error: micError, listenOnce } = useSpeechToText();

  useEffect(() => {
    if (micError) setLocalError(micError);
  }, [micError]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleChange("imageData", reader.result);
      setPreviewName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setLocalError("Title keeps you honest—add one.");
      return;
    }
    setSaving(true);
    setLocalError(null);
    try {
      await onCreate(form);
      setForm(emptyForm);
      setPreviewName("");
    } catch (err) {
      setLocalError(err?.message || "Could not save note.");
    } finally {
      setSaving(false);
    }
  };

  const handleSummarize = () => {
    const summary = summarizer(form.content);
    handleChange("content", summary);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-900/80"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-base font-medium text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50"
          placeholder="Note title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <div className="flex items-center gap-2">
          {palette.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleChange("color", color)}
              className={`h-8 w-8 rounded-full border shadow-sm transition hover:scale-105 ${form.color === color ? "ring-2 ring-slate-400" : "ring-0"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <textarea
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
        rows="3"
        placeholder="Jot something imperfect..."
        value={form.content}
        onChange={(e) => handleChange("content", e.target.value)}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:shadow-md dark:bg-slate-800 dark:border-slate-700">
          <ImageIcon />
          <span>{previewName || "Add image"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files[0])} />
        </label>
        <button
          type="button"
          onClick={async () => {
            try {
              const transcript = await listenOnce();
              handleChange("content", `${form.content} ${transcript}`.trim());
            } catch (_) {
              /* swallow; errors handled in hook */
            }
          }}
          className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 shadow-sm transition hover:shadow-md dark:bg-slate-800 dark:border-slate-700 ${listening ? "opacity-70" : ""}`}
        >
          <MicIcon />
          {listening ? "Listening…" : "Voice to text"}
        </button>
        <button
          type="button"
          onClick={handleSummarize}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-medium text-amber-800 shadow-sm transition hover:shadow-md"
        >
          <SparklesIcon />
          Summarize
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:translate-y-px hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900"
          >
            {saving ? "Saving…" : "Save note"}
          </button>
        </div>
      </div>
      {localError && <p className="mt-2 text-sm text-rose-600">{localError}</p>}
    </form>
  );
};

NoteForm.propTypes = {
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCreate: PropTypes.func.isRequired,
  summarizer: PropTypes.func.isRequired,
};

export default NoteForm;
