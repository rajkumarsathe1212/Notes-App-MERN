
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { Pin } from "lucide-react";

function NoteCard({ note }) {
  return (
    <Link to={`/note/${note._id}`}>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-800 line-clamp-1">
            {note.title}
          </h2>

          {note.isPinned && (
            <Pin
              size={18}
              className="text-amber-500 shrink-0"
              fill="currentColor"
            />
          )}
        </div>

        <p className="mb-4 whitespace-pre-wrap text-sm leading-6 text-slate-500 line-clamp-3">
          {note.content || "No content yet."}
        </p>

        {Array.isArray(note.tags) && note.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between gap-4 text-xs text-slate-400">
          <span>Created: {formatDate(note.createdAt)}</span>
          <span>Updated: {formatDate(note.updatedAt)}</span>
        </div>

      </article>
    </Link>
  );
}

export default NoteCard;
