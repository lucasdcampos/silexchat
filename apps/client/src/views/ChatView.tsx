import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import type { User } from '../models/user';
import { ParsedMessage } from '../components/ParsedMessage';
import { MessageActions } from '../MessageActions';
import { Avatar } from '../components/Avatar';
import type { Message } from '../models/message';
import type { Chat } from '../models/chat';
import { getChatDisplayData } from '../utils';
import api from '../api';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

interface ChatViewProps {
  chat: Chat;
  currentUser: User;
  socket: Socket | null;
  onClose: () => void;
  onOpenProfile: (user: User | Chat) => void;
}

export function ChatView({ chat, currentUser, socket, onClose, onOpenProfile }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const displayData = getChatDisplayData(chat, currentUser.id);

  const handleHeaderClick = () => {
    if (chat.type === 'GROUP') {
      onOpenProfile(chat);
    } else {
      const otherUser = chat.participants.find(p => p.user.id !== currentUser.id)?.user;
      if (otherUser) onOpenProfile(otherUser);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const fetchHistory = async () => {
      try {
        const response = await api.get(`/api/messages/${chat.id}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }
    };
    fetchHistory();

    const handleChatMessage = (message: Message) => {
      if (message.chatId === chat.id) {
        setMessages(prev => [...prev, message]);
      }
    };

    const handleMessageConfirmed = ({ tempId, message }: { tempId: number, message: Message }) => {
      setMessages(prev => 
        prev.map(m => (m.id === tempId ? { ...message, sender: currentUser } : m))
      );
    };

    socket.on('chatMessage', handleChatMessage);
    socket.on('messageConfirmed', handleMessageConfirmed);

    return () => {
      socket.off('chatMessage', handleChatMessage);
      socket.off('messageConfirmed', handleMessageConfirmed);
    };
  }, [chat.id, socket, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const tempId = -Math.random();
      socket.emit('chatMessage', {
        chatId: chat.id,
        content: newMessage,
        tempId: tempId,
      });
      
      const temporaryMessage: Message = {
        id: tempId,
        senderId: currentUser.id,
        content: newMessage,
        createdAt: new Date().toISOString(),
        chatId: chat.id,
        sender: currentUser,
      };
      setMessages(prev => [...prev, temporaryMessage]);
      setNewMessage('');
    }
  };

  const handleCopyId = (id: number) => {
    if (id > 0) {
        navigator.clipboard.writeText(id.toString());
    }
    setActiveMenu(null);
  };

  const handleDelete = async (id: number) => {
    if (id < 0) {
        setActiveMenu(null);
        return;
    }
    try {
      await api.delete(`/api/messages/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (error: any) {
      console.error("Error deleting message:", error.response?.data?.message || error.message);
    }
    setActiveMenu(null);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <button onClick={handleHeaderClick} className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-700">
          <Avatar avatarUrl={displayData.avatarUrl} username={displayData.name} />
          <h2 className="text-xl font-semibold">{displayData.name}</h2>
        </button>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
          <XIcon className="h-5 w-5" />
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === currentUser.id;
          const showHeader = !isSender && (index === 0 || messages[index - 1].senderId !== msg.senderId);

          return (
            <div key={msg.id} className={`flex items-start gap-3 ${isSender ? 'justify-end' : 'justify-start'} ${showHeader ? 'mt-4' : 'mt-1'}`}>
              <div className="w-8 flex-shrink-0">
                {showHeader && msg.sender && (
                  <button onClick={() => onOpenProfile(msg.sender!)} className="rounded-full">
                    <Avatar avatarUrl={msg.sender.avatarUrl} username={msg.sender.username} size="sm" />
                  </button>
                )}
              </div>
              
              <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
                {showHeader && msg.sender && (
                  <button onClick={() => onOpenProfile(msg.sender!)} className="text-sm font-semibold text-gray-300 mb-1 ml-2 hover:underline">
                    {msg.sender.username}
                  </button>
                )}
                <div className={`group flex items-center gap-2 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
                  {isSender && (
                    <div className="relative">
                      <button onClick={() => setActiveMenu(activeMenu === msg.id ? null : msg.id)} className="opacity-0 group-hover:opacity-100 text-gray-400">
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                      {activeMenu === msg.id && (
                        <MessageActions messageId={msg.id} onCopy={handleCopyId} onDelete={handleDelete} />
                      )}
                    </div>
                  )}
                  
                  <div className={`max-w-lg p-3 rounded-lg ${
                      isSender 
                      ? 'bg-emerald-600' 
                      : 'bg-gray-700'
                  }`}>
                      <div className="flex items-end gap-2">
                        <div className="min-w-0">
                          <ParsedMessage text={msg.content} />
                        </div>
                        <span className={`text-xs flex-shrink-0 pb-0.5 ${
                            isSender ? 'text-emerald-200' : 'text-gray-400'
                        }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <footer className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="ml-4 p-3 bg-emerald-600 rounded-full hover:bg-emerald-700">&rarr;</button>
        </form>
      </footer>
    </div>
  );
}
