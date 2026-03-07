import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  password: string; // simple demo password (plaintext for this toy OS)
}

interface UserState {
  users: User[];
  activeUserId: string | null;
  createUser: (name: string, password: string) => void;
  deleteUser: (id: string) => void;
  login: (name: string, password: string) => boolean;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: 'user_guest',
          name: 'Guest',
          password: '',
        },
      ],
      activeUserId: null,

      createUser: (name, password) =>
        set((state) => {
          const id = `user_${Date.now()}`;
          return {
            users: [...state.users, { id, name, password }],
          };
        }),

      deleteUser: (id) =>
        set((state) => {
          const remaining = state.users.filter((u) => u.id !== id);
          return {
            users: remaining.length > 0 ? remaining : state.users,
            activeUserId: state.activeUserId === id ? null : state.activeUserId,
          };
        }),

      login: (name, password) => {
        const user = get().users.find((u) => u.name === name);
        if (!user) return false;
        if (user.password !== password) return false;
        set({ activeUserId: user.id });
        return true;
      },

      logout: () => set({ activeUserId: null }),
    }),
    {
      name: 'cartoonos-users',
    },
  ),
);

