import type { Chat } from '../models/chat';

interface ChatActionsMenuProps {
  chat: Chat;
  isPinned: boolean;
  onPinToggle: () => void;
  onHide: () => void;
  onClose: () => void;
}

export function ChatActionsMenu({ isPinned, onPinToggle, onHide, onClose }: ChatActionsMenuProps) {
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="absolute top-0 right-8 bg-gray-900 rounded-md shadow-lg p-1 z-20 w-40">
      <ul className="text-sm text-white">
        <li>
          <button
            onClick={() => handleAction(onPinToggle)}
            className="w-full text-left px-3 py-1.5 hover:bg-gray-700 rounded-md"
          >
            {isPinned ? 'Unpin Chat' : 'Pin Chat'}
          </button>
        </li>
        <li>
          <button
            onClick={() => handleAction(onHide)}
            className="w-full text-left px-3 py-1.5 text-red-500 hover:bg-gray-700 rounded-md"
          >
            Close Chat
          </button>
        </li>
      </ul>
    </div>
  );
}