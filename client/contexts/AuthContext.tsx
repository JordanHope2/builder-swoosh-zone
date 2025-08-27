import React, { createContext, useContext } from 'react';
import { useAuthStore } from '@/stores/auth';

const AuthContext = createContext(useAuthStore);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={useAuthStore}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const store = useContext(AuthContext);
  return store();
}
