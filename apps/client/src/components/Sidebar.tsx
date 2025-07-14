import React, { useEffect, useRef, useState } from 'react';
import type { User } from '../models/user';
import { Avatar } from './Avatar';
import type { Chat } from '../models/chat';
import { ChatActionsMenu } from '../views/ChatActionsMenu';

const MoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.15l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.15l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const PinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 17v5" /><path d="M12 7V2" /><path d="M17 12H7" /><path d="M22 12H2" /><path d="m15 15-3-3-3 3" /><path d="m9 9 3 3 3-3" />
  </svg>
);

const getChatDisplayData = (chat: Chat, currentUserId: number) => {
  if (chat.type === 'GROUP') {
    return { name: chat.name || 'Group', avatarUrl: chat.avatarUrl };
  }
  const otherParticipant = chat.participants.find(p => p.userId !== currentUserId);
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
  onPinChat: (chatId: number, isPinned: boolean) => void;
  onOpenSettings: () => void;
  onOpenProfile: (user: User) => void;
}

export function Sidebar({ 
  currentUser, 
  chats, 
  isChatsLoading, 
  activeChatId, onSelectChat, 
  onNewChat, onLogout, onHideChat, 
  onOpenSettings, 
  onOpenProfile,
  onPinChat }: SidebarProps) {
    
  const [menuOpenForChat, setMenuOpenForChat] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenForChat(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);
  
  const sortedChats = [...chats].sort((a, b) => {
    const aParticipant = a.participants.find(p => p.userId === currentUser?.id);
    const bParticipant = b.participants.find(p => p.userId === currentUser?.id);
    const aIsPinned = aParticipant?.isPinned || false;
    const bIsPinned = bParticipant?.isPinned || false;

    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <aside className="w-80 bg-gray-900 flex flex-col p-3">
      <button onClick={onNewChat} className="w-full py-2 mb-4 text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors">
        New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-400 uppercase px-2 mb-2">Chats</h2>
        {isChatsLoading ? (
          <p className="text-gray-400 text-sm px-2">Loading chats...</p>
        ) : (
          <ul>
            {sortedChats.map(chat => {
              if (!currentUser) return null;
              const displayData = getChatDisplayData(chat, currentUser.id);
              const participantData = chat.participants.find(p => p.userId === currentUser.id);
              const isPinned = participantData?.isPinned || false;
              return (
                <li key={chat.id} 
                    className={`group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-700 ${activeChatId === chat.id ? 'bg-gray-700' : ''}`}
                    onClick={() => onSelectChat(chat)}>
                  <div className="flex items-center gap-3 flex-1 truncate">
                    <Avatar avatarUrl={displayData.avatarUrl} username={displayData.name} size="sm" />
                    <span className="flex-1 truncate">{displayData.name}</span>
                    {isPinned && <PinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                  </div>
                  <div className="relative" ref={menuOpenForChat === chat.id ? menuRef : null}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenForChat(menuOpenForChat === chat.id ? null : chat.id);
                      }}
                      className="p-1 rounded-full text-gray-500 hover:bg-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                      aria-label={`Chat options`}>
                        <MoreIcon className="h-4 w-4" />
                    </button>
                    {menuOpenForChat === chat.id && (
                      <ChatActionsMenu 
                        chat={chat}
                        isPinned={isPinned}
                        onPinToggle={() => onPinChat(chat.id, !isPinned)}
                        onHide={() => onHideChat(chat.id)}
                        onClose={() => setMenuOpenForChat(null)}
                      />
                    )}
                  </div>
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