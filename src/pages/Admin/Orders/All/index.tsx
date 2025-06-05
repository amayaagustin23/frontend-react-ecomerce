import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Collapse, List, Tag, Spin } from 'antd';
import { Order } from '@/types/Order';
import { useTranslation } from 'react-i18next';
import { getAllOrders } from '@/services/calls/panel.service';
import styles from './AllPage.module.scss';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const OrdersPanelPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders({ page: 1, size: 10 });
        setOrders(response.data.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const columns = [
    {
      title: t('orders.customer'),
      dataIndex: ['user', 'person', 'name'],
      key: 'customer',
    },
    {
      title: t('orders.email'),
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: t('orders.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'PAID' ? 'green' : status === 'PENDING' ? 'orange' : 'red';
        return <Tag color={color}>{t(`paymentStatus.${status}`)}</Tag>;
      },
    },
    {
      title: t('orders.subtotal'),
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (value: number) => `$${value}`,
    },
    {
      title: t('orders.shipping'),
      dataIndex: 'shippingCost',
      key: 'shipping',
      render: (value: number) => `$${value}`,
    },
    {
      title: t('orders.total'),
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => <b>${value}</b>,
    },
  ];

  return (
    <Card>
      <Title level={3}>{t('orders.titlePanel')}</Title>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          expandable={{
            expandedRowRender: (record: Order) => (
              <Collapse>
                <Panel header={t('orders.products')} key="1">
                  <List
                    dataSource={record.items}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.product.name}
                          description={
                            <>
                              {t('orders.quantity')}: {item.quantity} | {t('orders.variant.size')}:{' '}
                              {item.variant?.size || t('orders.empty')} |{' '}
                              {t('orders.variant.color')}:{' '}
                              {item.variant?.color ? (
                                <input
                                  type="color"
                                  value={item.variant.color}
                                  disabled
                                  className={styles.colorPicker}
                                />
                              ) : (
                                t('orders.empty')
                              )}
                            </>
                          }
                        />
                        <Text strong>${item.finalPrice}</Text>
                      </List.Item>
                    )}
                  />
                </Panel>
              </Collapse>
            ),
          }}
        />
      )}
    </Card>
  );
};

export default OrdersPanelPage;
