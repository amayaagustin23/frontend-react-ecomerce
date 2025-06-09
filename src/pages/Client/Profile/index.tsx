import React, { useEffect, useState } from 'react';
import { Tabs, Typography, List, Card, Button, Space, Radio } from 'antd';
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
import NumberFlow from '@number-flow/react';
import AddAddressModal from '@/components/AddAdressModal';
import { AddressDto } from '@/types/Auth';
import { Address } from '@/types/User';

const { Title, Paragraph, Text } = Typography;

const UserProfilePage = () => {
  const { t } = useTranslation();
  const { user, fetchUser, addAddress, updateAddress, deleteAddress, defaultAddress } = useAuth();
  const { orders, fetchOrders } = useOrder();
  const { generalCoupons, userCoupons, exchangeCouponCode, fetchGeneralCoupons, fetchUserCoupons } =
    useCoupon();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchGeneralCoupons();
    fetchUserCoupons();
  }, []);

  useEffect(() => {
    if (user?.addresses?.length) {
      const defaultAddress = user.addresses.find((addr) => addr.isDefault);
      setSelectedAddressId(defaultAddress?.id || null);
    }
  }, [user]);

  const redirect = (id: string) => {
    navigate(ORDER_ROUTES.getDetailPath(id));
  };

  const handleSaveAddress = (values: { address: AddressDto }) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, values.address);
    } else {
      addAddress(values.address);
    }
    setEditingAddress(null);
    setOpenModal(false);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress({ address: { ...address }, id: address.id });
    setOpenModal(true);
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
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
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 3,
              lg: 5,
            }}
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
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 3,
              lg: 5,
            }}
            dataSource={userCoupons}
            renderItem={(item: Coupon) => (
              <List.Item>
                <Card className={styles.userCouponCardExchange}>
                  <div className={styles.discount}>-{item.value}%</div>
                  <Text copyable>{item.code}</Text>
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

            <div className={styles.addressHeader}>
              <Title level={5}>{t('profile.addresses')}</Title>
              <Button
                type="primary"
                onClick={() => {
                  setEditingAddress(null);
                  setOpenModal(true);
                }}
              >
                {t('actions.addAddress', 'Agregar dirección')}
              </Button>
            </div>

            <Radio.Group
              value={selectedAddressId}
              onChange={(e) => defaultAddress(e.target.value)}
              style={{ width: '100%' }}
            >
              {user?.addresses.map((address) => (
                <Card key={address.id} className={styles.addressCard}>
                  <Radio value={address.id}>
                    {`${address.street}, ${address.city}, ${address.province}, CP ${address.postalCode}`}
                  </Radio>
                  {address.isDefault && (
                    <div className={styles.defaultTag}>{t('profile.defaultAddress')}</div>
                  )}
                  <div className={styles.actions}>
                    <Button size="small" onClick={() => handleEditAddress(address)}>
                      {t('actions.edit')}
                    </Button>
                    <Button size="small" danger onClick={() => handleDeleteAddress(address.id)}>
                      {t('actions.delete')}
                    </Button>
                  </div>
                </Card>
              ))}
            </Radio.Group>
          </Card>
        </>
      ),
    },
  ];

  return (
    <div className={styles.userProfilePage}>
      <Title>
        {t('profile.hello')} {user?.name}
      </Title>
      <Title level={4}>
        {t('profile.points')} <NumberFlow value={user?.points} />{' '}
      </Title>
      <Tabs defaultActiveKey="1" items={items} centered />
      <AddAddressModal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingAddress(null);
        }}
        onFinish={handleSaveAddress}
        initialValues={editingAddress}
      />
    </div>
  );
};

export default UserProfilePage;
