function DeleteModal({ open, onClose, onDelete, loading = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-3 text-2xl font-bold">Delete Note</h2>

        <p className="mb-6 text-slate-600">
          Are you sure you want to delete this note?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2 hover:bg-slate-100"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
