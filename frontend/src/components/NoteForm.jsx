import { useEffect, useState } from "react";

const parseTags = (value = "") =>
  [...new Set(
    value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  )];

function NoteForm({
  initialTitle = "",
  initialContent = "",
  initialTags,
  initialPinned = false,
  onSubmit,
  loading = false,
  storageKey,
}) {
  const initialTagsValue = Array.isArray(initialTags)
    ? initialTags.join(", ")
    : "";
  const readDraft = () => {
    if (!storageKey) {
      return null;
    }

    try {
      const draft = localStorage.getItem(storageKey);
      return draft ? JSON.parse(draft) : null;
    } catch {
      localStorage.removeItem(storageKey);
      return null;
    }
  };
  const [savedDraft] = useState(() => readDraft());

  const [title, setTitle] = useState(savedDraft?.title ?? initialTitle);
  const [content, setContent] = useState(savedDraft?.content ?? initialContent);
  const [tags, setTags] = useState(savedDraft?.tags ?? initialTagsValue);
  const [isPinned, setIsPinned] = useState(
    savedDraft?.isPinned ?? initialPinned
  );
  const [titleError, setTitleError] = useState("");
  const [autoSaveMessage, setAutoSaveMessage] = useState(
    savedDraft ? "Draft restored" : ""
  );

  useEffect(() => {
    if (!storageKey) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            title,
            content,
            tags,
            isPinned,
            updatedAt: new Date().toISOString(),
          })
        );
        setAutoSaveMessage("Draft auto-saved");
      } catch {
        // Ignore storage errors so the form still works offline.
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [content, isPinned, storageKey, tags, title]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    setTitleError("");
    onSubmit({
      title,
      content,
      tags: parseTags(tags),
      isPinned,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <label className="mb-2 block font-medium">
          Title <span className="text-red-600">*</span>
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError("");
          }}
          className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 ${
            titleError ? "border-red-500" : "border-slate-300"
          }`}
          placeholder="Enter a clear note title"
        />
        {titleError && (
          <p className="mt-1 text-sm text-red-600">{titleError}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="mb-2 block font-medium">Content</label>

        <textarea
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
          placeholder="Write your note here..."
        />
      </div>

      <div className="mb-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <label className="mb-2 block font-medium">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            placeholder="work, ideas, interview"
          />
          <p className="mt-1 text-sm text-slate-500">
            Separate tags with commas.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Pin this note
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {autoSaveMessage || "Auto-save is enabled for drafts on this device."}
        </p>

        <button
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save Note"}
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
