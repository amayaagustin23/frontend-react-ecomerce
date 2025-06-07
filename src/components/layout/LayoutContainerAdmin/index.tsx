import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Drawer, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  GiftOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/Auth/AuthContext';
import { useTranslation } from 'react-i18next';
import styles from './LayoutContainerAdmin.module.scss';
import ThemeToggle from '../../ThemeToggle'; // Asegurate que la ruta sea correcta

import {
  PATH_ROUTE_PANEL_BRANDS,
  PATH_ROUTE_PANEL_CATEGORIES,
  PATH_ROUTE_PANEL_COUPONS,
  PATH_ROUTE_PANEL_ORDERS,
  PATH_ROUTE_PANEL_PRODUCTS,
  PATH_ROUTE_PANEL_USERS,
} from '@/router/paths';

const { Header, Sider, Content } = Layout;

const LayoutContainerAdmin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

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
      {!isMobile && (
        <Sider
          collapsible
          style={{ backgroundColor: '#263238' }}
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
      )}

      <Layout className={styles.mainLayout}>
        <Header className={styles.header}>
          <div className={styles.headerInner}>
            {isMobile && (
              <Button
                icon={<MenuOutlined style={{ color: 'white' }} />}
                onClick={toggleDrawer}
                className={styles.menuButton}
                type="text"
              />
            )}
            <div className={styles.rightContent}>
              <ThemeToggle />
              <Dropdown overlay={userMenu} trigger={['click']}>
                <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
              </Dropdown>
            </div>
          </div>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>

      <Drawer
        style={{ backgroundColor: '#263238' }}
        title={<span style={{ color: 'white' }}>{t('layout.menu.title', 'Menú Admin')}</span>}
        placement="left"
        closable
        closeIcon={<CloseOutlined style={{ color: 'white' }} />}
        onClose={toggleDrawer}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.replace('/', '')]}
          items={menuItems.map((item) => ({
            ...item,
            onClick: () => {
              item.onClick?.();
              setDrawerVisible(false);
            },
          }))}
        />
      </Drawer>
    </Layout>
  );
};

export default LayoutContainerAdmin;
