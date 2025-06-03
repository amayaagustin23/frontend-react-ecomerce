import React, { useEffect } from 'react';
import { Tabs, Typography, List, Card, Button, Space } from 'antd';
import styles from './UserProfilePage.module.scss';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/Auth/AuthContext';
import { useOrder } from '@/context/Order/OrderContext';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useNavigate } from 'react-router-dom';
import { ORDER_ROUTES } from '@/router/paths';
import { Coupon } from '@/types/Coupon';
import { useCoupon } from '@/context/Coupon/CouponContext';
import NumberFlow, { continuous } from '@number-flow/react';

dayjs.locale('es');

const { Title, Paragraph } = Typography;

const UserProfilePage = () => {
  const { t } = useTranslation();
  const { user, fetchUser } = useAuth();
  const { orders, fetchOrders } = useOrder();
  const { generalCoupons, userCoupons, exchangeCouponCode, fetchGeneralCoupons, fetchUserCoupons } =
    useCoupon();

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchGeneralCoupons();
    fetchUserCoupons();
  }, []);

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

          <Title level={5}>{t('coupons.available')}</Title>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={generalCoupons}
            renderItem={(item: Coupon) => (
              <List.Item>
                <Card className={styles.couponCard}>
                  <div className={styles.discount}>-{item.value}%</div>
                  <div>{item.price} pts</div>
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      exchangeCouponCode(item.code);
                      fetchUser();
                    }}
                    disabled={user ? user?.points < item.price : true}
                  >
                    {t('coupons.redeem')}
                  </Button>
                </Card>
              </List.Item>
            )}
          />

          <Title level={5}>{t('coupons.yours')}</Title>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={userCoupons}
            renderItem={(item: Coupon) => (
              <List.Item>
                <Card className={styles.userCouponCard}>
                  <div className={styles.discount}>-{item.value}%</div>
                  <div>{item.code}</div>
                  <div>
                    {t('coupons.expiration')}: {dayjs(item.expiresAt).format('DD/MM/YYYY')}
                  </div>
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
      <Title>Hola {user?.name}</Title>
      <Title level={4}>
        Puntos: <NumberFlow plugins={[continuous]} value={user?.points} />{' '}
      </Title>
      <Tabs defaultActiveKey="1" items={items} centered />
    </div>
  );
};

export default UserProfilePage;
