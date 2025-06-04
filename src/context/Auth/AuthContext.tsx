import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/User';
import {
  getMe,
  registerUser,
  recoverPassword as recoverPasswordApi,
  resetPassword as resetPasswordApi,
  logoutSession,
} from '@/services/calls/auth.service';
import {
  addFavoriteProduct as addFavoriteProductApi,
  deleteFavoriteProduct as deleteFavoriteProductApi,
  addressDefaultUpdate,
  updateUserAddress,
  deleteUserAddress,
  createUserAddress,
  defaultChangeUserAddress,
} from '@/services/calls/user.service';
import { PATH_ROUTE_LOGIN } from '@/router/paths';
import { RegisterUserDto, RecoverPasswordDto, ResetPasswordDto } from '@/types/Auth';
import Cookies from 'js-cookie';

type AuthContextType = {
  user: User | null;
  isLogin: boolean;
  setUser: (user: User | null) => void;
  setIsLogin: (value: boolean) => void;
  logout: () => void;
  fetchUser: () => void;
  register: (body: RegisterUserDto) => Promise<void>;
  recoverPassword: (body: RecoverPasswordDto) => Promise<void>;
  resetPassword: (body: ResetPasswordDto) => Promise<void>;
  addFavoriteProduct: (productId: string) => Promise<void>;
  deleteFavoriteProduct: (productId: string) => Promise<void>;
  addAddress: (data: any) => Promise<void>;
  updateAddress: (id: string, data: any) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  defaultAddress: (id: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

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

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    setIsLogin(false);
    logoutSession();
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; Max-Age=0; path=/`;
    });
    window.location.href = PATH_ROUTE_LOGIN;
  };

  const register = async (body: RegisterUserDto) => {
    await registerUser(body);
  };

  const recoverPassword = async (body: RecoverPasswordDto) => {
    await recoverPasswordApi(body);
  };

  const resetPassword = async (body: ResetPasswordDto) => {
    await resetPasswordApi(body);
  };

  const addFavoriteProduct = async (productId: string) => {
    await addFavoriteProductApi(productId);
    fetchUser();
  };

  const deleteFavoriteProduct = async (productId: string) => {
    await deleteFavoriteProductApi(productId);
    fetchUser();
  };

  const addAddress = async (data: any) => {
    await createUserAddress(data);
    fetchUser();
  };

  const defaultAddress = async (id: string) => {
    await defaultChangeUserAddress(id);
    fetchUser();
  };

  const updateAddressById = async (id: string, data: any) => {
    await updateUserAddress(id, data);
    fetchUser();
  };

  const deleteAddressById = async (id: string) => {
    await deleteUserAddress(id);
    fetchUser();
  };

  const setDefaultAddress = async (id: string) => {
    await addressDefaultUpdate(id);
    fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogin,
        setUser,
        setIsLogin,
        logout,
        fetchUser,
        register,
        recoverPassword,
        resetPassword,
        addFavoriteProduct,
        deleteFavoriteProduct,
        addAddress,
        updateAddress: updateAddressById,
        deleteAddress: deleteAddressById,
        setDefaultAddress,
        defaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
