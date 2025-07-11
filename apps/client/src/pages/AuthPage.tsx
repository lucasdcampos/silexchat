import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const publicKey = `pub_key_for_${username}`; // Placeholder

    try {
      const regRes = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, publicKey }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.message);
      
      const logRes = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const logData = await logRes.json();
      if (!logRes.ok) throw new Error(logData.message);
      
      localStorage.setItem('silex_token', logData.token);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem('silex_token', data.token);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white font-sans p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-2xl shadow-slate-900/50">
        <div className="flex flex-col items-center space-y-2">
          <ShieldIcon className="h-10 w-10 text-indigo-400" />
          <h1 className="text-4xl font-bold text-slate-100">Silex</h1>
          <p className="text-slate-400">{isLoginView ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>
        
        {error && <p className="text-red-400 text-center bg-red-900/50 p-2 rounded-md text-sm">{error}</p>}

        <form className="space-y-4" onSubmit={isLoginView ? handleLogin : handleRegister}>
          {!isLoginView && (
            <div>
              <label className="text-sm font-medium text-slate-300">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" className="w-full py-2.5 text-white font-semibold bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-800">
            {isLoginView ? 'Log In' : 'Register'}
          </button>
        </form>
        <p className="text-sm text-center text-slate-400">
          {isLoginView ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-medium text-indigo-400 hover:underline ml-1">
            {isLoginView ? 'Register' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}