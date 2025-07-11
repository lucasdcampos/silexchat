import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: number;
  username: string;
}

interface Message {
  senderId: number;
  content: string;
  createdAt: string;
}

interface ChatPageProps {
  userToChatWith: User;
  onBack: () => void;
}

export function ChatPage({ userToChatWith, onBack }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('silex_token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser({ id: payload.id, username: payload.username });
    } catch (e) {
      console.error("Failed to decode token", e);
      return;
    }

    const newSocket = io(API_URL, { auth: { token } });
    setSocket(newSocket);

    newSocket.on('privateMessage', (message: Message) => {
      if (message.senderId === userToChatWith.id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => { newSocket.disconnect(); };
  }, [userToChatWith.id]);

  useEffect(() => {
    const token = localStorage.getItem('silex_token');
    if (!token) return;

    const fetchConversation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/messages/conversation/${userToChatWith.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log(`[DEBUG] Fetched conversation with user ${userToChatWith.id}:`, data);
        if (response.ok) {
          setMessages(data);
        } else {
          setError(data.message || 'Failed to load conversation history.');
          setMessages([]);
        }
      } catch (error) {
        setError('A network error occurred. Could not load history.');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConversation();
  }, [userToChatWith.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket && currentUser) {
      const messagePayload = {
        recipientId: userToChatWith.id,
        content: newMessage,
      };
      socket.emit('privateMessage', messagePayload);
      
      setMessages(prev => [...prev, { senderId: currentUser.id, content: newMessage, createdAt: new Date().toISOString() }]);
      setNewMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button onClick={onBack}>&larr; Voltar</button>
        <h3>Conversation with {userToChatWith.username}</h3>
      </div>
      <div style={{ flexGrow: 1, padding: '10px', overflowY: 'auto' }}>
        {loading && <p>Loading conversation...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && !error && messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.senderId === currentUser?.id ? 'right' : 'left', margin: '5px 0' }}>
            <p style={{ background: '#f1f1f1', padding: '10px', borderRadius: '10px', display: 'inline-block' }}>
              {msg.content}
            </p>
          </div>
        ))}
        {!loading && !error && messages.length === 0 && (
          <p>No messages yet. Start the conversation!</p>
        )}
      </div>
      <form onSubmit={handleSendMessage} style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '80%', padding: '10px' }}
        />
        <button type="submit" style={{ width: '18%', padding: '10px' }}>Send</button>
      </form>
    </div>
  );
}