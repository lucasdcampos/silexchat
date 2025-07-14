interface MessageActionsProps {
  messageId: number;
  onCopy: (id: number) => void;
  onDelete: (id: number) => void;
}

export function MessageActions({ messageId, onCopy, onDelete }: MessageActionsProps) {
  return (
    <div className="absolute top-0 right-full mr-2 bg-gray-800 rounded-md shadow-lg p-1 z-10">
      <ul className="text-sm text-white">
        <li>
          <button
            onClick={() => onCopy(messageId)}
            className="w-full text-left px-3 py-1.5 hover:bg-gray-700 rounded-md"
          >
            Copy Message ID
          </button>
        </li>
        <li>
          <button
            onClick={() => onDelete(messageId)}
            className="w-full text-left px-3 py-1.5 text-red-500 hover:bg-gray-700 rounded-md"
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}