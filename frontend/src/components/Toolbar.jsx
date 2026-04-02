import PropTypes from "prop-types";
import { MoonIcon, SunIcon } from "./icons.jsx";

const Toolbar = ({ search, onSearch, dark, onToggleDark }) => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">Leaf Notes</p>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-50">Ideas, lightly organized</h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search notes…"
            className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:bg-slate-900 dark:border-slate-700"
          />
          <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-slate-400">⌘K</span>
        </div>
        <button
          onClick={onToggleDark}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:shadow-md dark:bg-slate-900 dark:border-slate-700"
        >
          {dark ? <SunIcon /> : <MoonIcon />}
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </header>
  );
};

Toolbar.propTypes = {
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  dark: PropTypes.bool.isRequired,
  onToggleDark: PropTypes.func.isRequired,
};

export default Toolbar;
