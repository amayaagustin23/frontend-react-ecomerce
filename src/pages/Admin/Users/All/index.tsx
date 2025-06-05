import React, { useEffect } from 'react';
import { Card, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import CustomTable from '@/components/CustomTable';
import { useUser } from '@/context/User/UserContext';

const { Title } = Typography;

const UsersPanelPage = () => {
  const { users, loading, fetchUsers, pagination, deleteUserById, updateUserData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers({ page: 1, limit: 10 });
  }, [fetchUsers]);

  const handlePageChange = (pagination: any) => {
    fetchUsers({ page: pagination.current, limit: pagination.pageSize });
  };

  const handleView = (user: any) => {
    navigate(`/panel/users/${user.id}`);
  };

  const handleEdit = (user: any) => {
    navigate(`/panel/users/edit/${user.id}`);
  };

  const handleDelete = async (user: any) => {
    await deleteUserById(user.id);
  };

  const handleToggleActive = (user: any, active: boolean) => {
    updateUserData(user.id, { isActive: active });
  };

  return (
    <Card>
      <Title level={3}>Usuarios</Title>
      {loading ? (
        <Spin />
      ) : (
        <CustomTable
          data={users}
          columnsKeys={['name', 'email', 'role']}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          pagination={pagination}
          onChangePage={handlePageChange}
        />
      )}
    </Card>
  );
};

export default UsersPanelPage;
