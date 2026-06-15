
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { createNote } from "../services/noteService";

function CreateNote() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const storageKey = "note-draft:create";

  const handleSubmit = async (noteData) => {
    if (!noteData.title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await createNote(noteData);

      if (response.success) {
        localStorage.removeItem(storageKey);
        navigate("/");
      } else {
        setError(response.message || "Failed to create note");
      }
    } catch (err) {
      setError(err?.message || "Error creating note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">Create New Note</h1>
        <p className="mt-2 text-slate-500">Write something amazing today.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-600">{error}</div>
      )}

      <NoteForm onSubmit={handleSubmit} loading={loading} storageKey={storageKey} />
    </div>
  );
}

export default CreateNote;
