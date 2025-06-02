import React from 'react';
import { useCart } from '@/context/Cart/CartContext';
import { Button, Typography, Row, Col, Divider, Empty, InputNumber, Image, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './CartPage.module.scss';
import { useOrder } from '@/context/Order/OrderContext';

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { cart, cartItems, updateQuantity, removeItem, getTotal } = useCart();
  const { createOrder } = useOrder();
  return (
    <div className={styles.container}>
      <Title level={2}>{t('cart.title')}</Title>

      {!cartItems || cartItems?.length === 0 ? (
        <Empty description={t('cart.empty')} className={styles.emptyCart} />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {cartItems.map((item) => (
              <Col span={24} key={item.id}>
                <Card className={styles.itemCard}>
                  <Row align="middle" justify="space-between" gutter={[8, 8]}>
                    <Col xs={24} sm={4}>
                      <Image
                        src={item.product.images?.[0]?.url || ''}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        preview={false}
                        className={styles.productImage}
                      />
                    </Col>

                    <Col xs={24} sm={10}>
                      <Text strong>{item.product.name}</Text>
                      <div className={styles.variant}>
                        {item.variant?.size} / {item.variant?.color}
                      </div>
                    </Col>

                    <Col xs={24} sm={4}>
                      <Text>
                        ${item.finalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </Text>
                    </Col>

                    <Col xs={24} sm={4}>
                      <InputNumber
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.id, value || 1)}
                      />
                    </Col>

                    <Col xs={24} sm={2}>
                      <Button danger type="link" onClick={() => removeItem(item.id)}>
                        {t('cart.remove')}
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />

          <Row justify="end" className={styles.totalSection}>
            <Col>
              <Title level={3}>
                {t('cart.total')}: $
                {getTotal().toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </Title>

              <Button type="primary" size="large" onClick={() => cart?.id && createOrder(cart.id)}>
                {t('cart.checkout')}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default CartPage;
