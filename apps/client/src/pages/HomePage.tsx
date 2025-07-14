import React, { useState } from 'react';
import type { User } from '../models/user';
import api from '../api';

interface HomePageProps {
  onStartDM: (user: User) => void;
  onLogout: () => void;
  onOpenNewChatModal: () => void;
}

export function HomePage({ onStartDM, onLogout, onOpenNewChatModal }: HomePageProps) {
  const [searchUsername, setSearchUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!searchUsername.trim()) {
      setError('Please enter a username.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<User>(`/users/username/${searchUsername}`);
      onStartDM(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || `User "${searchUsername}" not found.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Home</h2>
        <button onClick={onLogout} className="text-sm text-red-400 hover:underline">Log out</button>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="font-semibold mb-2">Start a new conversation</h3>
        <p className="text-sm text-gray-400 mb-4">Enter the username of the person you want to chat with.</p>
        <form onSubmit={handleStartConversation} className="flex gap-2">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Enter username..."
            className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="px-4 py-2 font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors" disabled={loading}>
            {loading ? 'Searching...' : 'Chat'}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="mt-6 text-center text-sm text-gray-400">
          <span>or </span>
          <button onClick={onOpenNewChatModal} className="font-semibold text-emerald-400 hover:underline">
            create or join a group
          </button>
        </div>
      </div>
    </div>
  );
}