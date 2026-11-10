import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { users } from '../data/mockData';
import { AuthContext } from './AuthContext';
import type { AppUser } from '../types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('student-health-hub-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser) as AppUser);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      login: (email: string, password: string, role: AppUser['role']) => {
        const matchedUser = users.find(
          (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.role === role,
        );

        if (!matchedUser) {
          const fallback = users.find((entry) => entry.role === role) ?? users[0];
          setUser(fallback);
          localStorage.setItem('student-health-hub-user', JSON.stringify(fallback));
          return;
        }

        if (password.length === 0) {
          setUser(matchedUser);
          localStorage.setItem('student-health-hub-user', JSON.stringify(matchedUser));
          return;
        }

        setUser(matchedUser);
        localStorage.setItem('student-health-hub-user', JSON.stringify(matchedUser));
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem('student-health-hub-user');
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

