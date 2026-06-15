import { useEffect, useState } from "react";

import SearchBar from "../components/Searchbar";
import NoteCard from "../components/NoteCard";

import { getNotes, searchNotes } from "../services/noteService";

function Home() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          search.trim() === "" ? await getNotes() : await searchNotes(search);

        if (isActive && response.success) {
          setNotes(response.data);
        }
      } catch (err) {
        if (isActive) {
          setError(err?.message || "Failed to fetch notes.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [search]);

  const activeSearch = search.trim();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">My Notes</h1>
          <p className="mt-2 text-slate-500">
            Create, organize and search your notes.
          </p>
        </div>

        {activeSearch && (
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Searching for "{activeSearch}"
          </div>
        )}
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow">
          <h2 className="mb-2 text-3xl font-bold">No Notes Found</h2>
          <p className="text-slate-500">
            Create your first note or clear the search to see everything.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
