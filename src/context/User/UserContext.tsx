import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllUsers, getUserById, updateUser, deleteUser } from '@/services/calls/user.service';
import { User } from '@/types/User';
import { TablePaginationConfig } from 'antd/es/table';

interface UserContextProps {
  users: User[];
  userDetails: User | null;
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
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = useCallback(async (params = { page: 1, limit: 10 }) => {
    setLoading(true);
    try {
      const res = await getAllUsers(params);
      setUsers(res.data.data); // ajustá según tu backend
      setPagination({
        current: res.data.page,
        pageSize: res.data.limit,
        total: res.data.total,
      });
    } catch (err) {
      console.error('Error al obtener usuarios', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await getUserById(id);
      setUserDetails(res.data);
    } catch (err) {
      console.error('Error al obtener usuario por ID', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserData = useCallback(
    async (id: string, data: any) => {
      setLoading(true);
      try {
        await updateUser(id, data);
        await fetchUsers(); // refresca la lista
      } catch (err) {
        console.error('Error al actualizar usuario', err);
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
        await fetchUsers(); // refresca la lista
      } catch (err) {
        console.error('Error al eliminar usuario', err);
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
