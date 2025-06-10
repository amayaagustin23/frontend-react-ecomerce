import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getPanelUserById,
} from '@/services/calls/user.service';
import { User, UserWithOrders } from '@/types/User';
import { TablePaginationConfig } from 'antd/es/table';
import { useMessageApi } from '../Message/MessageContext';

interface UserContextProps {
  users: User[];
  userDetails: UserWithOrders | null;
  loading: boolean;
  pagination: TablePaginationConfig;
  fetchUsers: (pagination?: { page: number; limit: number }) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  updateUserData: (id: string, data: any) => Promise<void>;
  deleteUserById: (id: string) => Promise<void>;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userDetails, setUserDetails] = useState<UserWithOrders | null>(null);
  const [loading, setLoading] = useState(false);
  const message = useMessageApi();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = useCallback(async (params = { page: 1, limit: 10 }) => {
    setLoading(true);
    try {
      const res = await getAllUsers(params);
      setUsers(res.data.data);
      setPagination({
        current: res.data.page,
        pageSize: res.data.limit,
        total: res.data.total,
      });
    } catch (err) {
      message.error('Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await getPanelUserById(id);
      setUserDetails(res.data);
    } catch (err) {
      message.error('Error al obtener usuario por ID');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserData = useCallback(
    async (id: string, data: any) => {
      setLoading(true);
      try {
        await updateUser(id, data);
        await fetchUsers();
      } catch (err) {
        message.error('Error al actualizar usuario');
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const deleteUserById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await deleteUser(id);
        await fetchUsers();
      } catch (err) {
        message.error('Error al eliminar usuario');
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  return (
    <UserContext.Provider
      value={{
        users,
        userDetails,
        loading,
        pagination,
        fetchUsers,
        fetchUserById,
        updateUserData,
        deleteUserById,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};
