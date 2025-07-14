import type { User } from '../models/user';
import type { Chat } from '../models/chat';
import { Avatar } from '../components/Avatar';

const StatusIndicator = ({ status }: { status?: string }) => {
  const statusClasses = {
    ONLINE: 'bg-green-500',
    AFK: 'bg-yellow-500',
    OFFLINE: 'bg-gray-500',
  }[status || 'OFFLINE'];

  return <span className={`absolute bottom-0 right-0 block h-5 w-5 rounded-full border-2 border-gray-800 ${statusClasses}`}></span>;
};

interface ProfileModalProps {
  data: User | Chat | null;
  currentUser: User | null;
  onClose: () => void;
  onOpenGroupSettings: (chat: Chat) => void;
}

export function ProfileModal({ data, currentUser, onClose, onOpenGroupSettings }: ProfileModalProps) {
  if (!data) return null;

  const isGroup = 'type' in data && data.type === 'GROUP';
  const isOwner = isGroup && (data as Chat).ownerId === currentUser?.id;
  
  const displayData = {
    name: isGroup ? (data as Chat).name : (data as User).username,
    avatarUrl: data.avatarUrl,
  };

  return (
    <div className="fixed inset-0 bg-gray-800/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar avatarUrl={displayData.avatarUrl} username={displayData.name} size="lg" />
            {!isGroup && <StatusIndicator status={(data as User).status} />}
          </div>
          <h2 className="text-2xl font-bold">{displayData.name}</h2>
        </div>
        
        <div className="text-left w-full mt-6 space-y-4">
          {isGroup ? (
            <>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Invite Code</h3>
                <p className="text-sm text-gray-300 bg-gray-700 p-2 rounded-md font-mono">{(data as Chat).inviteCode}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Members</h3>
                <p className="text-sm text-gray-300">{(data as Chat).participants.length} member(s)</p>
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">About</h3>
              <p className="text-sm text-gray-300 break-words">{(data as User).about || 'No information available.'}</p>
            </div>
          )}
           <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Created At</h3>
            <p className="text-sm text-gray-300">{new Date(data.createdAt!).toLocaleDateString()}</p>
          </div>
        </div>

        {isOwner && (
          <button onClick={() => onOpenGroupSettings(data as Chat)} className="mt-4 w-full px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700">
            Edit Group
          </button>
        )}

        <button onClick={onClose} className="mt-2 w-full px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600">
          Close
        </button>
      </div>
    </div>
  );
}