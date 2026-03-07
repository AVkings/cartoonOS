import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { Lock, UserPlus } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const { users, login, createUser } = useUserStore();
  const [selectedName, setSelectedName] = useState(users[0]?.name ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(selectedName, password);
    if (!ok) {
      setError('Wrong password or unknown user.');
      return;
    }
    setError('');
    setPassword('');
    onUnlock();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newUserName.trim();
    if (!name) return;
    createUser(name, newUserPassword);
    setSelectedName(name);
    setNewUserName('');
    setNewUserPassword('');
  };

  return (
    <div className="fixed inset-0 bg-neo-blue flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white border-[4px] border-black shadow-[10px_10px_0_0_#000] rounded-2xl w-full max-w-md p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Lock size={26} />
          <div>
            <h1 className="text-2xl font-black">CartoonOS Lock Screen</h1>
            <p className="text-xs font-semibold text-gray-600">
              Pick a user and enter the password to unlock.
            </p>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="flex flex-col gap-3">
          <label className="text-xs font-bold">
            User
            <select
              value={selectedName}
              onChange={(e) => {
                setSelectedName(e.target.value);
                setPassword('');
                setError('');
              }}
              className="mt-1 w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] bg-neo-yellow/40"
            >
              {users.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name || '(unnamed)'}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-bold">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-mono shadow-[2px_2px_0_0_#000]"
              placeholder={selectedName === 'Guest' ? '(leave empty for Guest)' : '••••••'}
            />
          </label>

          {error && <p className="text-xs font-bold text-red-600">{error}</p>}

          <button
            type="submit"
            className="neo-btn bg-neo-green px-4 py-2 font-black text-sm mt-1"
          >
            Unlock Desktop
          </button>
        </form>

        <form
          onSubmit={handleCreateUser}
          className="border-t-2 border-black pt-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-700">
            <UserPlus size={14} />
            Add new user
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="flex-1 px-2 py-1 border-2 border-black rounded text-xs font-bold shadow-[1px_1px_0_0_#000]"
              placeholder="Username"
            />
            <input
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              className="flex-1 px-2 py-1 border-2 border-black rounded text-xs font-mono shadow-[1px_1px_0_0_#000]"
              placeholder="Password"
            />
            <button
              type="submit"
              className="neo-btn bg-neo-pink px-3 py-1 text-xs font-black"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

