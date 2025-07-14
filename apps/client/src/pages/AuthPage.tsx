import React, { useState } from 'react';
import api from '../api';

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const publicKey = `pub_key_for_${username}`;

    try {
      await api.post('/auth/register', { username, email, password, publicKey });
      await handleLogin(e, true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent, fromRegister = false) => {
    if (!fromRegister) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('silex_token', data.accessToken);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      if (!fromRegister) setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white font-sans p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-2xl shadow-gray-900/30">
        <div className="flex flex-col items-center space-y-2">
          <ShieldIcon className="h-10 w-10 text-emerald-400" />
          <h1 className="text-4xl font-bold text-gray-100">Silex</h1>
          <p className="text-gray-400">{isLoginView ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>
        
        {error && <p className="text-red-400 text-center bg-red-900/50 p-2 rounded-md text-sm">{error}</p>}

        <form className="space-y-4" onSubmit={isLoginView ? handleLogin : handleRegister}>
          {!isLoginView && (
            <div>
              <label className="text-sm font-medium text-gray-300">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button type="submit" className="w-full py-2.5 text-white font-semibold bg-emerald-500 rounded-md hover:bg-emerald-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-800" disabled={loading}>
            {loading ? 'Processing...' : (isLoginView ? 'Log In' : 'Register')}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          {isLoginView ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-medium text-emerald-400 hover:underline ml-1">
            {isLoginView ? 'Register' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
