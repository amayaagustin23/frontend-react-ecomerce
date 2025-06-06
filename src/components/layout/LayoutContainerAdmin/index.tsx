import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/Auth/AuthContext';
import styles from './LayoutContainerAdmin.module.scss';
import {
  PATH_ROUTE_PANEL_BRANDS,
  PATH_ROUTE_PANEL_CATEGORIES,
  PATH_ROUTE_PANEL_COUPONS,
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
  const [collapsed, setCollapsed] = React.useState(false);

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
      icon: <TagOutlined />,
      onClick: () => navigate(PATH_ROUTE_PANEL_BRANDS),
    },
    {
      key: PATH_ROUTE_PANEL_COUPONS,
      label: t('adminMenu.coupons'),
      icon: <GiftOutlined />,
      onClick: () => navigate(PATH_ROUTE_PANEL_COUPONS),
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
    <Layout className={styles.layoutContainerAdmin}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={200}
        className={styles.sider}
      >
        <div className={styles.logo}>{collapsed ? 'A' : 'Admin'}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.replace('/', '')]}
          items={menuItems}
          className={styles.menu}
        />
      </Sider>

      <Layout className={styles.mainLayout}>
        <Header className={styles.header}>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
          </Dropdown>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutContainerAdmin;
