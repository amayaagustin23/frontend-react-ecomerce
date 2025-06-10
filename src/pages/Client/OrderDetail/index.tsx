import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Divider, Spin, Tag, List, Image, Button } from 'antd';
import { useOrder } from '@/context/Order/OrderContext';
import styles from './OrderDetailPage.module.scss';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useTranslation } from 'react-i18next';

dayjs.locale('es');
const { Title, Text } = Typography;

const statusColor: Record<string, string> = {
  PAID: 'green',
  PENDING: 'orange',
  CANCELLED: 'red',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, order, orderLoading } = useOrder();
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      getOrderById(id);
    }
  }, [id]);

  if (orderLoading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className={styles.orderDetailPage}>
      <Card>
        <Button type="link" onClick={() => navigate('/perfil')}>
          ← {t('common.back')}
        </Button>
        <Title level={3}>
          {t('orderDetail.orderId', { id: order.id.slice(0, 8).toUpperCase() })}
        </Title>
        <Text strong>{t('orderDetail.date')}:</Text>{' '}
        {dayjs(order.createdAt).format('D [de] MMMM YYYY')}
        <br />
        <Text strong>{t('orderDetail.status')}:</Text>{' '}
        <Tag color={statusColor[order.status]}>{t(`orderStatus.${order.status}`)}</Tag>
        <br />
        <Text strong>{t('orderDetail.total')}:</Text> $
        {order.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        <br />
        <Text strong>{t('orderDetail.shipping')}:</Text> $
        {order.shippingCost.toLocaleString('es-AR')}
        <Divider />
        <Title level={4}>{t('orderDetail.products')}</Title>
        <List
          itemLayout="vertical"
          dataSource={order.items}
          renderItem={({ product, quantity, finalPrice, variant }) => (
            <List.Item>
              <Card>
                <div className={styles.productItem}>
                  <Image width={150} src={variant.images?.[0]?.url} alt={product.name} />
                  <div className={styles.productInfo}>
                    <Title level={4}>{product.name}</Title>
                    <Text>
                      {t('orderDetail.category')}: {product.category.name}
                    </Text>
                    <Text>
                      {t('orderDetail.brand')}: {product.brand.name}
                    </Text>
                    <Text>
                      {t('orderDetail.color')}: {String(variant.color)} | {t('orderDetail.size')}:{' '}
                      {String(variant.size)}
                    </Text>
                    <Text>
                      {t('orderDetail.quantity')}: {quantity}
                    </Text>
                  </div>
                  <div className={styles.productPrice}>
                    <Text strong>{t('orderDetail.subtotal')}:</Text>
                    <Text>
                      $
                      {(finalPrice * quantity).toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default OrderDetailPage;
