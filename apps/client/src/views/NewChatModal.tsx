import React, { useState, useEffect } from 'react';
import type { Chat } from '../models/chat';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatStarted: (chat: Chat) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function NewChatModal({ isOpen, onClose, onChatStarted }: NewChatModalProps) {
  const [view, setView] = useState<'dm' | 'create' | 'join'>('dm');
  const [dmUsername, setDmUsername] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupAvatarUrl, setGroupAvatarUrl] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    const token = localStorage.getItem('silex_token');
    let endpoint = '';
    let body = {};

    switch (view) {
      case 'dm':
        endpoint = `${API_URL}/api/chats/dm`;
        body = { partnerUsername: dmUsername };
        break;
      case 'create':
        endpoint = `${API_URL}/api/chats/groups`;
        body = { name: groupName, avatarUrl: groupAvatarUrl };
        break;
      case 'join':
        endpoint = `${API_URL}/api/chats/join`;
        body = { inviteCode };
        break;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onChatStarted(data);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    handleAction().finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isOpen) {
      setDmUsername('');
      setGroupName('');
      setGroupAvatarUrl('');
      setInviteCode('');
      setError('');
      setView('dm');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (view) {
      case 'create':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Group Name</label>
              <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Enter group name" required className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" autoFocus />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Avatar URL (Optional)</label>
              <input type="text" value={groupAvatarUrl} onChange={e => setGroupAvatarUrl(e.target.value)} placeholder="http://..." className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        );
      case 'join':
        return (
          <div>
            <label className="text-sm font-medium text-gray-300">Invite Code</label>
            <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Enter invite code" required className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" autoFocus />
          </div>
        );
      case 'dm':
      default:
        return (
          <div>
            <label className="text-sm font-medium text-gray-300">Username</label>
            <input type="text" value={dmUsername} onChange={e => setDmUsername(e.target.value)} placeholder="Enter username" required className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" autoFocus />
          </div>
        );
    }
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    switch (view) {
      case 'create': return 'Create';
      case 'join': return 'Join';
      default: return 'Chat';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex border-b border-gray-700 mb-4 text-sm">
          <button onClick={() => setView('dm')} className={`flex-1 py-2 font-semibold ${view === 'dm' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>DM</button>
          <button onClick={() => setView('create')} className={`flex-1 py-2 font-semibold ${view === 'create' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>Create</button>
          <button onClick={() => setView('join')} className={`flex-1 py-2 font-semibold ${view === 'join' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>Join</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderContent()}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700" disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
              {getButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}