import React from 'react';
import type { User } from '../models/user';
import { Avatar } from './Avatar';
import type { Chat } from '../models/chat';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.15l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.15l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const getChatDisplayData = (chat: Chat, currentUserId: number) => {
  if (chat.type === 'GROUP') {
    return { name: chat.name || 'Group', avatarUrl: chat.avatarUrl };
  }
  const otherParticipant = chat.participants.find(p => p.user.id !== currentUserId);
  return {
    name: otherParticipant?.user.username || 'Direct Message',
    avatarUrl: otherParticipant?.user.avatarUrl,
  };
};

interface SidebarProps {
  currentUser: User | null;
  chats: Chat[];
  isChatsLoading: boolean;
  activeChatId?: number | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  onLogout: () => void;
  onHideChat: (chatId: number) => void;
  onOpenSettings: () => void;
  onOpenProfile: (user: User) => void;
}

export function Sidebar({ currentUser, chats, isChatsLoading, activeChatId, onSelectChat, onNewChat, onLogout, onHideChat, onOpenSettings, onOpenProfile }: SidebarProps) {
  return (
    <aside className="w-80 bg-gray-800 flex flex-col p-3">
      <button onClick={onNewChat} className="w-full py-2 mb-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
        New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-400 uppercase px-2 mb-2">Chats</h2>
        {isChatsLoading ? (
          <p className="text-gray-400 text-sm px-2">Loading chats...</p>
        ) : (
          <ul>
            {chats.map(chat => {
              if (!currentUser) return null;
              const displayData = getChatDisplayData(chat, currentUser.id);
              return (
                <li key={chat.id} 
                    className={`group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-700 ${activeChatId === chat.id ? 'bg-gray-700' : ''}`}
                    onClick={() => onSelectChat(chat)}>
                  <div className="flex items-center gap-3 flex-1 truncate">
                    <Avatar avatarUrl={displayData.avatarUrl} username={displayData.name} size="sm" />
                    <span className="flex-1 truncate">{displayData.name}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onHideChat(chat.id);
                    }}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                    aria-label={`Hide chat`}>
                      <XIcon className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="pt-2 border-t border-gray-700">
        <div className="flex items-center justify-between gap-3">
          {currentUser && (
            <button onClick={() => onOpenProfile(currentUser)} className="flex items-center gap-3 flex-1 truncate p-1 rounded-md hover:bg-gray-700">
              <Avatar avatarUrl={currentUser.avatarUrl} username={currentUser.username} />
              <span className="font-semibold truncate">{currentUser.username}</span>
            </button>
          )}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={onOpenSettings} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
              <SettingsIcon className="h-5 w-5" />
            </button>
            <button onClick={onLogout} className="text-sm text-red-400 hover:text-white">
              Log out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}