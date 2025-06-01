import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/User';
import { getMe } from '@/services/calls/auth.service';

type AuthContextType = {
  user: User | null;
  isLogin: boolean;
  setUser: (user: User | null) => void;
  setIsLogin: (value: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        setUser(response.data);
        setIsLogin(true);
      } catch {
        setUser(null);
        setIsLogin(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    setIsLogin(false);
    document.cookie = 'access_token=; Max-Age=0; path=/';
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLogin, setUser, setIsLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
