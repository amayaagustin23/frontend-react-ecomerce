import React, { useState, useRef, use, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LaptopOutlined,
  NotificationOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Badge, AutoComplete, Input, Drawer, Button } from 'antd';
import type { MenuProps } from 'antd';
import { useCart } from '@/context/Cart/CartContext';
import { useAuth } from '@/context/Auth/AuthContext';
import { useProduct } from '@/context/Product/ProductContext';
import {
  PATH_ROUTE_CART,
  PATH_ROUTE_CONTACT,
  PATH_ROUTE_HOME,
  PATH_ROUTE_LOGIN,
  PATH_ROUTE_PRODUCTS,
  PATH_ROUTE_PROFILE,
  PRODUCT_ROUTES,
} from '@/router/paths';
import { useTranslation } from 'react-i18next';
import styles from './LayoutContainerClient.module.scss';
import ThemeToggle from '../../ThemeToggle';

const { Header, Content, Footer } = Layout;

const LayoutContainerClient: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { getQuantityTotal, cart } = useCart();

  const { user, isLogin, logout } = useAuth();
  const { fetchFilteredProducts, productsFiltered } = useProduct();
  const [itemCount, setItemCount] = useState(getQuantityTotal());
  const [searchValue, setSearchValue] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchFilteredProducts({ page: 1, size: 10, search: value });
    }, 2000);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const leftMenuItems: MenuProps['items'] = [
    {
      key: PATH_ROUTE_HOME,
      icon: <HomeOutlined />,
      label: t('layout.menu.home'),
      onClick: () => navigate(PATH_ROUTE_HOME),
    },
    {
      key: PATH_ROUTE_PRODUCTS,
      icon: <LaptopOutlined />,
      label: t('layout.menu.products'),
      onClick: () => navigate(PATH_ROUTE_PRODUCTS),
    },
    {
      key: PATH_ROUTE_CONTACT,
      icon: <NotificationOutlined />,
      label: t('layout.menu.contact'),
      onClick: () => navigate(PATH_ROUTE_CONTACT),
    },
  ];

  const rightMenuItems: MenuProps['items'] = [
    {
      key: PATH_ROUTE_CART,
      icon: (
        <Badge count={itemCount} size="small" offset={[2, -2]}>
          <ShoppingCartOutlined />
        </Badge>
      ),
      onClick: () => navigate(PATH_ROUTE_CART),
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: isLogin ? user?.name || t('layout.menu.account') : t('layout.menu.account'),
      children: isLogin
        ? [
            {
              key: 'profile',
              label: t('layout.menu.myProfile'),
              onClick: () => navigate(PATH_ROUTE_PROFILE),
            },
            {
              key: 'logout',
              label: t('layout.menu.logout'),
              onClick: logout,
            },
          ]
        : [
            {
              key: 'login',
              label: t('layout.menu.login'),
              onClick: () => navigate(PATH_ROUTE_LOGIN),
            },
          ],
    },
  ];

  const redirect = (id: string) => {
    navigate(PRODUCT_ROUTES.getDetailPath(id));
  };

  useEffect(() => {
    setItemCount(getQuantityTotal());
  }, [cart]);

  return (
    <Layout className={styles.layoutContainer}>
      <Header className={styles.header}>
        {isMobile ? (
          <>
            <div className={styles.mobileHeader}>
              <Button icon={<MenuOutlined />} type="text" onClick={toggleMobileMenu} />
              <ThemeToggle />
            </div>

            <Drawer
              title={t('layout.menu.title')}
              placement="left"
              closable
              onClose={toggleMobileMenu}
              open={isMobileMenuOpen}
            >
              <Menu
                mode="inline"
                items={[...leftMenuItems, ...rightMenuItems]}
                onClick={toggleMobileMenu}
              />
            </Drawer>
          </>
        ) : (
          <>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={leftMenuItems}
              className={styles.leftMenu}
            />

            <div className={styles.centerMenu}>
              <AutoComplete
                className={styles.searchBox}
                value={searchValue}
                onSearch={handleSearch}
                onSelect={(id: string) => redirect(id)}
                options={productsFiltered.map((product) => ({
                  value: product.id,
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }}>{product.name}</span>
                        <span style={{ color: '#888' }}>
                          ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ),
                }))}
                placeholder={t('layout.search.placeholder')}
              >
                <Input
                  allowClear
                  onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
                  suffix={<SearchOutlined />}
                />
              </AutoComplete>
            </div>
            <div>
              <ThemeToggle />
            </div>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={rightMenuItems}
              className={styles.rightMenu}
            />
          </>
        )}
      </Header>

      <Content className={styles.contentWrapper}>
        <Layout
          className={styles.innerContent}
          style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
        >
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>
      </Content>

      <Footer className={styles.footer}>
        {t('layout.footer.text', { year: new Date().getFullYear() })}
      </Footer>
    </Layout>
  );
};

export default LayoutContainerClient;
