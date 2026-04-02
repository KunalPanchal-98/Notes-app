import { useEffect, useMemo, useState } from "react";
import api from "./api.js";
import Toolbar from "./components/Toolbar.jsx";
import NoteForm from "./components/NoteForm.jsx";
import NoteCard from "./components/NoteCard.jsx";

const palette = ["#f7f7f5", "#fef3c7", "#e0f2fe", "#fbcfe8", "#dcfce7", "#ffe4e6", "#ede9fe"];

const summarize = (text) => {
  if (!text) return "";
  const sentences = text.split(/[.!?]/).filter(Boolean);
  if (sentences.length === 0) return text.slice(0, 120) + (text.length > 120 ? "…" : "");
  const snippet = sentences.slice(0, 2).join(". ");
  return snippet.length > 160 ? `${snippet.slice(0, 160)}…` : snippet;
};

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [dark, setDark] = useState(false);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
    );
  }, [notes, search]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (err) {
        setError("Could not load notes. Is the API awake?");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const res = await api.post("/notes", payload);
      setNotes((prev) => [res.data, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add note.");
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const res = await api.put(`/notes/${id}`, payload);
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data : n)));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Update fizzled.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch {
      setError("Delete failed; maybe the note already vanished.");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-slate-950 text-slate-50" : "bg-[#f8f5ef] text-slate-900"}`}>
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <Toolbar
          search={search}
          onSearch={setSearch}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
        />

        <NoteForm
          palette={palette}
          onCreate={handleCreate}
          summarizer={summarize}
        />

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-500">Loading your notes…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-slate-500 shadow-inner">
            <p className="text-lg font-semibold text-slate-600">No notes yet</p>
            <p className="text-sm">Start with a quick thought; perfection can wait.</p>
          </div>
        ) : (
          <section className="grid gap-4 note-grid">
            {filtered.map((note, idx) => (
              <NoteCard
                key={note._id}
                note={note}
                palette={palette}
                onEdit={() => setEditingId(note._id)}
                onSave={(payload) => handleUpdate(note._id, payload)}
                onDelete={() => handleDelete(note._id)}
                editing={editingId === note._id}
                className={idx % 5 === 0 ? "shadow-lg" : ""}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
