import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LaptopOutlined,
  NotificationOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Badge } from 'antd';
import type { MenuProps } from 'antd';
import { useCart } from '@/context/Cart/CartContext';
import { PATH_ROUTE_HOME } from '@/router/paths';
import { useAuth } from '@/context/Auth/AuthContext';

const { Header, Content, Footer } = Layout;

const LayoutContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { cartItems } = useCart();
  const { user, isLogin, logout } = useAuth();

  const itemCount = cartItems.length;

  const leftMenuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Inicio',
      onClick: () => navigate('/'),
    },
    {
      key: '/productos',
      icon: <LaptopOutlined />,
      label: 'Productos',
      onClick: () => navigate('/productos'),
    },
    {
      key: '/contacto',
      icon: <NotificationOutlined />,
      label: 'Contacto',
      onClick: () => navigate('/contacto'),
    },
  ];

  const rightMenuItems: MenuProps['items'] = [
    {
      key: '/cart',
      icon: (
        <Badge count={itemCount} size="small" offset={[2, -2]}>
          <ShoppingCartOutlined />
        </Badge>
      ),
      onClick: () => navigate('/cart'),
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: isLogin ? user?.name || 'Cuenta' : 'Cuenta',
      children: isLogin
        ? [
            {
              key: 'profile',
              label: 'Mi perfil',
              onClick: () => navigate('/perfil'),
            },
            {
              key: 'logout',
              label: 'Cerrar sesión',
              onClick: logout,
            },
          ]
        : [
            {
              key: 'login',
              label: 'Iniciar sesión',
              onClick: () => navigate('/login'),
            },
          ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          background: '#fff',
        }}
      >
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={leftMenuItems}
          style={{ borderBottom: 'none', flex: 1 }}
        />

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={rightMenuItems}
          style={{ borderBottom: 'none', width: '12rem' }}
        />
      </Header>

      <Content style={{ flex: 1, padding: '1rem' }}>
        <Layout
          style={{
            marginBlock: '2rem',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: '100%',
          }}
        >
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Outlet />
          </Content>
        </Layout>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        Mi Tienda ©{new Date().getFullYear()} - Todos los derechos reservados
      </Footer>
    </Layout>
  );
};

export default LayoutContainer;
