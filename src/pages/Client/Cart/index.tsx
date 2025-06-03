import React, { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Image,
  InputNumber,
  Button,
  Card,
  Divider,
  Input,
  message,
  Empty,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/Cart/CartContext';
import { useOrder } from '@/context/Order/OrderContext';
import styles from './CartPage.module.scss';
import MercadopagoLogo from '/src/assets/images/mercado-pago-logo.png';
import { PRODUCT_ROUTES } from '@/router/paths';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    cart,
    cartItems,
    updateQuantity,
    removeItem,
    getTotal,
    coupon,
    addCouponCode,
    getTotalFinalPrice,
  } = useCart();
  const { createOrder } = useOrder();

  const [couponCode, setCouponCode] = useState('');

  const redirect = (id: string) => {
    navigate(PRODUCT_ROUTES.getDetailPath(id));
  };
  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <div className={styles.saludo}>{t('cart.greeting')}</div>
          <Title level={2}>{t('cart.title')}</Title>
          <Text>
            {t('cart.totalProducts', { count: cartItems.length })}{' '}
            <strong>${getTotal().toLocaleString('es-AR')}</strong>
          </Text>
          <br />
          <Text type="secondary">{t('cart.notReserved')}</Text>

          <div className={styles.alert}>
            🔔 <strong>{t('cart.alertTitle')}</strong>
            <br />
            {t('cart.alertDescription')}
          </div>

          {cartItems.length === 0 ? (
            <Empty description={t('cart.empty')} />
          ) : (
            cartItems.map((item) => (
              <Card
                key={item.id}
                className={styles.itemCard}
                onClick={() => redirect(item.productId)}
              >
                <Row justify="space-between" align="middle">
                  <Col span={4}>
                    <Image
                      src={item.product.images?.[0]?.url}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      preview={false}
                    />
                  </Col>
                  <Col span={12}>
                    <Text strong>{item.product.name}</Text>
                    <div>
                      {t('cart.size')}: {item.variant?.size} / {t('cart.color')}:{' '}
                      {item.variant?.color}
                    </div>
                  </Col>
                  <Col span={3}>
                    {item.discount > 0 && cart?.coupon ? (
                      <div>
                        <Text delete style={{ fontSize: '0.9rem', color: '#999' }}>
                          ${item.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </Text>
                        <br />
                        <Text>
                          ${item.finalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </Text>
                      </div>
                    ) : (
                      <Text>
                        ${item.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </Text>
                    )}
                  </Col>

                  <Col span={3}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(val) => updateQuantity(item.id, val || 1)}
                    />
                  </Col>
                  <Col span={2}>
                    <Button type="link" danger onClick={() => removeItem(item.id)}>
                      ✕
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </Col>

        <Col xs={24} md={8}>
          <Title level={4}>{t('cart.summary')}</Title>
          <Row justify="space-between">
            <Text strong>{t('cart.total')}</Text>
            <Text delete={cart?.coupon ? true : false}>
              ${getTotal().toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Text>
          </Row>

          {cart && cart.coupon && (
            <Row justify="space-between">
              <Text type="secondary" style={{ fontSize: '0.9rem' }}>
                {t('cart.withDiscount', { percent: cart?.coupon.value })}
              </Text>
              <Text strong>
                ${getTotalFinalPrice().toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </Text>
            </Row>
          )}

          <Row justify="space-between">
            <Text>{t('cart.delivery')}</Text>
            <Text>{t('cart.free')}</Text>
          </Row>
          <Divider />
          <Row justify="space-between">
            <Text strong>{t('cart.total')}</Text>
          </Row>
          {coupon && (
            <Row justify="space-between">
              <Text type="secondary">{t('cart.discount', { code: coupon.code })}</Text>
            </Row>
          )}

          <Divider />

          <Input
            placeholder={t('cart.enterCoupon')}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <Button block onClick={() => cart && addCouponCode(cart?.id, { couponCode })}>
            {t('cart.usePromoCode')}
          </Button>

          <Button
            type="primary"
            block
            size="large"
            style={{ marginTop: '1rem' }}
            onClick={() => cart?.id && createOrder(cart.id)}
          >
            {t('cart.checkout')} →
          </Button>

          <div className={styles.paymentIcons}>
            <Image
              src={MercadopagoLogo}
              alt="Mercado Pago"
              preview={false}
              className={styles.mercadoPagoLogo}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
