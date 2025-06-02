import React, { useEffect } from 'react';
import { Tabs, Typography, List, Card } from 'antd';
import styles from './UserProfilePage.module.scss';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/Auth/AuthContext';
import { useOrder } from '@/context/Order/OrderContext';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useNavigate } from 'react-router-dom';
import { ORDER_ROUTES } from '@/router/paths';
import { Order } from '@/types/Order';

dayjs.locale('es');

const { Title, Paragraph } = Typography;

const UserProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { orders, fetchOrders } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const coupons = [
    { discount: '-15%', points: 1000 },
    { discount: '-20%', points: 2500 },
    { discount: '-25%', points: 6000 },
    { discount: '-30%', points: 8000 },
  ];

  const redirect = (id: string) => {
    navigate(ORDER_ROUTES.getDetailPath(id));
  };

  const items = [
    {
      key: '1',
      label: t('tabs.coupons'),
      children: (
        <>
          <Title level={4}>{t('coupons.title')}</Title>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={coupons}
            renderItem={(item) => (
              <List.Item>
                <Card className={styles.couponCard}>
                  <div className={styles.discount}>{item.discount}</div>
                  <div>{item.points} pts</div>
                </Card>
              </List.Item>
            )}
          />
        </>
      ),
    },
    {
      key: '2',
      label: t('tabs.orders'),
      children: (
        <>
          <Title level={4}>{t('orders.title')}</Title>
          <div className={styles.ordersContainer}>
            {orders.map((order, i) => (
              <Card key={i} className={styles.orderCard} onClick={() => redirect(order.id)}>
                <p>
                  <strong>
                    {dayjs(order.createdAt).format('D [de] MMM [de] YYYY').toUpperCase()}
                  </strong>{' '}
                  | ${order.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
                <p>
                  {t('orders.orderNumber')}: #{order.id.slice(0, 8).toUpperCase()}
                </p>

                <div className={styles.productImages}>
                  {order.items.map((item, idx) => (
                    <img
                      key={idx}
                      src={item.product.images[0].url}
                      alt="Producto"
                      className={styles.productThumb}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </>
      ),
    },
    {
      key: '3',
      label: t('tabs.profile'),
      children: (
        <>
          <Title level={4}>{t('profile.title')}</Title>
          <Paragraph>{t('profile.description')}</Paragraph>

          <Card className={styles.infoCard}>
            <p>
              <strong>{t('profile.name')}:</strong> {user?.name}
            </p>
            <p>
              <strong>{t('profile.dni')}:</strong> {user?.cuitOrDni}
            </p>
            <p>
              <strong>{t('profile.email')}:</strong> {user?.email}
            </p>
            <p>
              <strong>{t('profile.phone')}:</strong> {user?.phone}
            </p>
            <p>
              <strong>{t('profile.password')}:</strong> ************
            </p>
          </Card>
        </>
      ),
    },
  ];

  return (
    <div className={styles.userProfilePage}>
      <Tabs defaultActiveKey="1" items={items} centered />
    </div>
  );
};

export default UserProfilePage;
