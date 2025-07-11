import React, { useState, useEffect } from 'react';
import type { Chat } from '../models/chat';
import { Avatar } from '../components/Avatar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface GroupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
  onUpdateSuccess: (updatedChat: Chat) => void;
}

export function GroupSettingsModal({ isOpen, onClose, chat, onUpdateSuccess }: GroupSettingsModalProps) {
  const [name, setName] = useState(chat.name || '');
  const [avatarUrl, setAvatarUrl] = useState(chat.avatarUrl || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(chat.name || '');
      setAvatarUrl(chat.avatarUrl || '');
      setError('');
    }
  }, [isOpen, chat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('silex_token');
    try {
      const res = await fetch(`${API_URL}/api/chats/groups/${chat.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, avatarUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update group settings.');

      onUpdateSuccess(data);
      onClose();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-6">Group Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar avatarUrl={avatarUrl} username={name} size="lg" />
            <input
              type="text"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="Group Avatar URL"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Group Name"
              required
              className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}