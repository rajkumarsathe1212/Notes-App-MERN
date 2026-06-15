function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search notes by title or content..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

export default SearchBar;
