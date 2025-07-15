interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags?: string[];
}

interface LocalNoteCardProps {
  note: Note;
}

export default function LocalNoteCard({ note }: LocalNoteCardProps) {
  return (
    <div className="note-card card-hover slide-up">
      <h3 className="text-ghost-white font-semibold mb-2 text-shimmer">
        {note.title}
      </h3>
      <p className="text-ghost-light text-sm mb-4 line-clamp-3">
        {note.content}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-ghost-muted">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
        {note.tags && note.tags.length > 0 && (
          <div className="flex gap-1">
            {note.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-ghost-purple/20 text-ghost-purple px-2 py-1 rounded glow-purple"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
