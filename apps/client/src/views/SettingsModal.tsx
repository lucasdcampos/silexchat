import React, { useState, useEffect } from 'react';
import type { User } from '../models/user';
import { Avatar } from '../components/Avatar';
import api from '../api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateSuccess: (updatedUser: User, newToken: string) => void;
}

export function SettingsModal({ isOpen, onClose, currentUser, onUpdateSuccess }: SettingsModalProps) {
  const [username, setUsername] = useState(currentUser.username);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [about, setAbout] = useState(currentUser.about || '');
  const [status, setStatus] = useState(currentUser.status || 'ONLINE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsername(currentUser.username);
      setAvatarUrl(currentUser.avatarUrl || '');
      setAbout(currentUser.about || '');
      setStatus(currentUser.status || 'ONLINE');
      setError('');
    }
  }, [isOpen, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.patch('/users/me', {
        username,
        avatarUrl,
        about,
        status,
      });

      onUpdateSuccess(data.user, data.token);
      onClose();

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-6">User Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar avatarUrl={avatarUrl} username={username} size="lg" />
            <input
              type="text"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="Avatar URL"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">About</label>
            <textarea
              value={about}
              onChange={e => setAbout(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
           <div>
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'ONLINE' | 'AFK' | 'OFFLINE')}
              className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ONLINE">Online</option>
              <option value="AFK">Away</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}