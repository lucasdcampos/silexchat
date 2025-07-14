import type { User } from '../models/user';

interface WelcomeViewProps {
  currentUser: User | null;
}

export function WelcomeView({ currentUser }: WelcomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
      <h2 className="text-2xl text-gray-300 font-semibold">
        Welcome, {currentUser?.username || 'User'}!
      </h2>
      <p className="mt-2">Select a conversation or start a new one.</p>
    </div>
  );
}