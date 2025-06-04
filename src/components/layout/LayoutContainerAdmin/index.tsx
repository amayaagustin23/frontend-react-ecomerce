import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  TagsOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/Auth/AuthContext';
import styles from './LayoutContainerAdmin.module.scss';

const { Header, Sider, Content } = Layout;

const LayoutContainerAdmin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    { key: '/admin/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
    { key: '/admin/users', label: 'Usuarios', icon: <UserOutlined /> },
    { key: '/admin/products', label: 'Productos', icon: <ShoppingOutlined /> },
    { key: '/admin/categories', label: 'Categorías', icon: <AppstoreOutlined /> },
    { key: '/admin/brands', label: 'Marcas', icon: <TagsOutlined /> },
  ];

  const handleMenuClick = ({ key }: { key: string }) => navigate(key);

  const userMenu = (
    <Menu
      items={[
        {
          key: 'logout',
          label: 'Cerrar sesión',
          icon: <LogoutOutlined />,
          onClick: logout,
        },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className={styles.logo}>Admin</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.rightContent}>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', background: colorBgContainer }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutContainerAdmin;
