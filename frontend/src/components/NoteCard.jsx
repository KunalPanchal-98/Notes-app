import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { EditIcon, TrashIcon } from "./icons.jsx";

const NoteCard = ({ note, onDelete, onEdit, onSave, editing, palette }) => {
  const [draft, setDraft] = useState({ title: note.title, content: note.content, color: note.color, imageData: note.imageData });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft({ title: note.title, content: note.content, color: note.color, imageData: note.imageData });
  }, [note]);

  const commit = async () => {
    setBusy(true);
    await onSave(draft);
    setBusy(false);
  };

  const colorDot = palette.includes(note.color) ? note.color : "#f7f7f5";

  return (
    <article
      className="group relative rounded-2xl border border-slate-200 shadow-card transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 fade-in"
      style={{ backgroundColor: note.color || "#f7f7f5" }}
    >
      <div className="absolute right-3 top-3 flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
        {!editing && (
          <button
            onClick={onEdit}
            className="rounded-full bg-white/80 p-2 text-slate-700 shadow-sm transition hover:shadow-md dark:bg-slate-900 dark:text-slate-100"
            title="Edit"
          >
            <EditIcon />
          </button>
        )}
        <button
          onClick={onDelete}
          className="rounded-full bg-white/80 p-2 text-rose-600 shadow-sm transition hover:shadow-md dark:bg-slate-900 dark:text-rose-400"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 pt-4 text-xs uppercase tracking-wide text-slate-500">
        <span className="h-2 w-2 rounded-full" style={{ background: colorDot }} />
        {new Date(note.updatedAt).toLocaleDateString()}
      </div>

      <div className="px-4 pb-4 pt-2 space-y-3">
        {editing ? (
          <>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white/60 px-3 py-2 text-base font-semibold outline-none"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white/60 px-3 py-2 text-sm outline-none"
              rows="4"
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {palette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setDraft({ ...draft, color })}
                    className={`h-7 w-7 rounded-full border shadow-sm ${draft.color === color ? "ring-2 ring-slate-500" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <button
                onClick={commit}
                disabled={busy}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg disabled:opacity-60 dark:bg-white dark:text-slate-900"
              >
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{note.title}</h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line">{note.content}</p>
            {note.imageData && (
              <img
                src={note.imageData}
                alt="note attachment"
                className="w-full rounded-xl border border-slate-200 object-cover shadow-sm"
              />
            )}
          </>
        )}
      </div>
    </article>
  );
};

NoteCard.propTypes = {
  note: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editing: PropTypes.bool,
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default NoteCard;
