import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";
import { getNoteById, deleteNote, togglePinNote } from "../services/noteService";
import { formatDate } from "../utils/formatDate";

function ViewNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pinning, setPinning] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const response = await getNoteById(id);

        if (response.success) {
          setNote(response.data);
        } else {
          setError(response.message || "Failed to fetch note");
        }
      } catch (err) {
        setError(err?.message || "Error loading note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await deleteNote(id);

      if (response.success) {
        navigate("/");
      } else {
        setError(response.message || "Failed to delete note");
        setShowDeleteModal(false);
      }
    } catch (err) {
      setError(err?.message || "Error deleting note");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePin = async () => {
    try {
      setPinning(true);
      const response = await togglePinNote(id);

      if (response.success) {
        setNote(response.data);
      } else {
        setError(response.message || "Failed to update pin state");
      }
    } catch (err) {
      setError(err?.message || "Error updating pin state");
    } finally {
      setPinning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="space-y-6">
        <Link to="/" className="font-medium text-blue-600 hover:text-blue-700">
          Back to Notes
        </Link>
        <div className="rounded-lg bg-red-100 p-4 text-red-600">
          {error || "Note not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="font-medium text-blue-600 hover:text-blue-700">
        Back to Notes
      </Link>

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-600">{error}</div>
      )}

      <div className="max-w-4xl rounded-2xl bg-white p-8 shadow">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {note.isPinned && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  Pinned
                </span>
              )}
              {Array.isArray(note.tags) &&
                note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            <h1 className="text-4xl font-bold text-slate-800">{note.title}</h1>
          </div>

          <button
            onClick={handleTogglePin}
            disabled={pinning}
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pinning
              ? "Updating..."
              : note.isPinned
              ? "Unpin Note"
              : "Pin Note"}
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-6 border-b border-slate-200 pb-6">
          <div>
            <p className="text-sm text-slate-500">Created</p>
            <p className="font-medium text-slate-700">
              {formatDate(note.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Last Updated</p>
            <p className="font-medium text-slate-700">
              {formatDate(note.updatedAt)}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
            {note.content || "(No content)"}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/edit/${note._id}`}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Edit Note
          </Link>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Delete Note
          </button>
        </div>
      </div>

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        loading={deleting}
      />
    </div>
  );
}

export default ViewNote;
