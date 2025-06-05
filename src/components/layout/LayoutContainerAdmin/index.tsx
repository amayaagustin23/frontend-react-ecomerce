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
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/Auth/AuthContext';
import styles from './LayoutContainerAdmin.module.scss';
import {
  PATH_ROUTE_PANEL_BRANDS,
  PATH_ROUTE_PANEL_CATEGORIES,
  PATH_ROUTE_PANEL_DASHBOARD,
  PATH_ROUTE_PANEL_ORDERS,
  PATH_ROUTE_PANEL_PRODUCTS,
  PATH_ROUTE_PANEL_USERS,
} from '@/router/paths';
import { useTranslation } from 'react-i18next';

const { Header, Sider, Content } = Layout;

const LayoutContainerAdmin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    {
      key: '',
      label: t('adminMenu.dashboard'),
      icon: <DashboardOutlined />,
      onClick: () => navigate(''),
    },
    {
      key: PATH_ROUTE_PANEL_ORDERS,
      label: t('adminMenu.orders'),
      icon: <ShoppingCartOutlined />,
      onClick: () => navigate(PATH_ROUTE_PANEL_ORDERS),
    },
    {
      key: PATH_ROUTE_PANEL_PRODUCTS,
      label: t('adminMenu.products'),
      icon: <ShoppingOutlined />,
      onClick: () => navigate(PATH_ROUTE_PANEL_PRODUCTS),
    },
    {
      key: PATH_ROUTE_PANEL_USERS,
      label: t('adminMenu.users'),
      icon: <UserOutlined />,
      onClick: () => navigate(PATH_ROUTE_PANEL_USERS),
    },
    {
      key: PATH_ROUTE_PANEL_CATEGORIES,
      label: t('adminMenu.categories'),
      icon: <AppstoreOutlined />,
      onClick: () => navigate(PATH_ROUTE_PANEL_CATEGORIES),
    },
    {
      key: PATH_ROUTE_PANEL_BRANDS,
      label: t('adminMenu.brands'),
      icon: <TagsOutlined />,
      onClick: () => navigate(PATH_ROUTE_PANEL_BRANDS),
    },
  ];

  const userMenu = (
    <Menu
      items={[
        {
          key: 'logout',
          label: t('adminMenu.logout'),
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
          selectedKeys={[location.pathname.replace('/', '')]}
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
