import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@/context/User/UserContext';
import { Card, Typography, Descriptions, Tag, Divider, List, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './DetailPage.module.scss';

const { Title, Text } = Typography;

const DetailUserPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { userDetails, fetchUserById, loading } = useUser();

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id]);

  if (loading) return <Spin tip={t('productDetail.loading')} />;
  if (!userDetails) return <Text>{t('productDetail.notFound')}</Text>;

  const defaultAddress = userDetails.addresses?.find((addr) => addr.isDefault);

  return (
    <div className={styles.container}>
      <Title level={2}>{t('productDetail.title')}</Title>

      <Card title={t('productDetail.accountInfo')} className={styles.card}>
        <Descriptions column={1}>
          <Descriptions.Item label={t('productDetail.email')}>
            {userDetails.email}
          </Descriptions.Item>
          <Descriptions.Item label={t('productDetail.role')}>
            <Tag color="blue">{userDetails.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('productDetail.points')}>
            {userDetails.points}
          </Descriptions.Item>
          <Descriptions.Item label={t('productDetail.active')}>
            <Tag color={userDetails.isActive ? 'green' : 'red'}>
              {userDetails.isActive ? t('productDetail.yes') : t('productDetail.no')}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t('productDetail.personalInfo')} className={styles.card}>
        <Descriptions column={1}>
          <Descriptions.Item label={t('productDetail.name')}>
            {userDetails.person?.name}
          </Descriptions.Item>
          <Descriptions.Item label={t('productDetail.phone')}>
            {userDetails.person?.phone}
          </Descriptions.Item>
          <Descriptions.Item label={t('productDetail.dni')}>
            {userDetails.person?.cuitOrDni}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {defaultAddress && (
        <Card title={t('productDetail.defaultAddress')} className={styles.card}>
          <Descriptions column={1}>
            <Descriptions.Item label={t('productDetail.street')}>
              {defaultAddress.street}
            </Descriptions.Item>
            <Descriptions.Item label={t('productDetail.city')}>
              {defaultAddress.city}
            </Descriptions.Item>
            <Descriptions.Item label={t('productDetail.province')}>
              {defaultAddress.province}
            </Descriptions.Item>
            <Descriptions.Item label={t('productDetail.postalCode')}>
              {defaultAddress.postalCode}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card title={t('productDetail.orders')} className={styles.card}>
        {userDetails.orders?.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={userDetails.orders}
            renderItem={(order) => (
              <Card
                key={order.id}
                type="inner"
                title={`${t('productDetail.orderId')}: ${order.id.slice(0, 8)}...`}
                className={styles.innerCard}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label={t('productDetail.status')}>
                    <Tag>{order.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('productDetail.total')}>
                    ${order.total.toFixed(2)}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('productDetail.paymentMethod')}>
                    {order.payment?.method || t('productDetail.noPayment')}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <List
                  header={<Text strong>{t('productDetail.products')}</Text>}
                  dataSource={order.items}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.product.name}
                        description={
                          <>
                            <div>
                              {t('productDetail.category')}: {item.product.category.name}
                            </div>
                            <div>
                              {t('productDetail.finalPrice')}: ${item.finalPrice.toFixed(2)}
                            </div>
                            <div className={styles.colorLine}>
                              <span>{t('productDetail.color')}:</span>
                              <span
                                className={styles.colorPreview}
                                style={{ backgroundColor: item.variant?.color }}
                              />
                            </div>

                            <div>
                              {t('productDetail.size')}: {item.variant?.size}
                            </div>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          />
        ) : (
          <Text>{t('productDetail.noOrders')}</Text>
        )}
      </Card>
    </div>
  );
};

export default DetailUserPage;
