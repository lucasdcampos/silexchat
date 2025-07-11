import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: number;
  username: string;
}

interface HomePageProps {
  onStartChat: (user: User) => void;
  onLogout: () => void;
}

export function HomePage({ onStartChat, onLogout }: HomePageProps) {
  const [searchUsername, setSearchUsername] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('silex_token');
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/users/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setAllUsers(data);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Could not load user list.');
      }
    };
    fetchUsers();
  }, []);

  const handleStartConversation = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const targetUser = allUsers.find(user => user.username.toLowerCase() === searchUsername.toLowerCase());

    if (targetUser) {
      onStartChat(targetUser);
    } else {
      setError(`User "${searchUsername}" not found.`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Home</h2>
        <button onClick={onLogout}>Log out</button>
      </div>
      <p>Welcome! Enter a username to start a conversation.</p>
      <form onSubmit={handleStartConversation}>
        <input
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          placeholder="Enter username"
          required
        />
        <button type="submit">Start Conversation</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}