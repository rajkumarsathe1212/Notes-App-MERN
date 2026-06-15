
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { getNoteById, updateNote } from "../services/noteService";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const storageKey = `note-draft:edit:${id}`;

  // Fetch note on component mount
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setFetching(true);
        const response = await getNoteById(id);

        if (response.success) {
          setNote(response.data);
        } else {
          setError(response.message || "Failed to fetch note");
        }
      } catch (err) {
        setError(err?.message || "Error loading note");
      } finally {
        setFetching(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSubmit = async (noteData) => {
    if (!noteData.title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await updateNote(id, noteData);

      if (response.success) {
        localStorage.removeItem(storageKey);
        navigate(`/note/${id}`);
      } else {
        setError(response.message || "Failed to update note");
      }
    } catch (err) {
      setError(err?.message || "Error updating note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-slate-800">Edit Note</h1>
        <div className="rounded-lg bg-red-100 p-4 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">Edit Note</h1>
        <p className="mt-2 text-slate-500">Update your note details.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-600">{error}</div>
      )}

      {note && (
        <NoteForm
          initialTitle={note.title}
          initialContent={note.content}
          initialTags={note.tags}
          initialPinned={note.isPinned}
          onSubmit={handleSubmit}
          loading={loading}
          storageKey={storageKey}
        />
      )}
    </div>
  );
}

export default EditNote;
