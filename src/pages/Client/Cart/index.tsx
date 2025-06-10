// CartPage con 3 tabs y soporte completo para CRUD de direcciones
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
  Tabs,
  Radio,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/Cart/CartContext';
import { useOrder } from '@/context/Order/OrderContext';
import { useAuth } from '@/context/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './CartPage.module.scss';
import MercadopagoLogo from '/src/assets/images/mercado-pago-logo.png';
import AddAddressModal from '@/components/AddAdressModal';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
  const { calculateShipping, createOrder } = useOrder();
  const { user, deleteAddress, updateAddress, addAddress } = useAuth();

  const [tabKey, setTabKey] = useState('1');
  const [couponCode, setCouponCode] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string | null>(null);
  const [postalCodeInput, setPostalCodeInput] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleSaveAddress = (values: { address: any }) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, values.address);
    } else {
      addAddress(values.address);
    }
    setEditingAddress(null);
    setOpenModal(false);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress({ address: { ...address }, id: address.id });
    setOpenModal(true);
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
  };

  const handleCalculate = async () => {
    if (!postalCodeInput.trim()) return message.warning('Ingresá un código postal válido');
    try {
      const res = await calculateShipping(postalCodeInput);
      if (res) {
        setShippingCost(res.shippingCost);
        setEstimatedDeliveryDate(res.estimatedDeliveryDate);
      }
      message.success('Costo de envío calculado');
      setTabKey('3');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Error al calcular el envío.');
    }
  };

  const handleConfirmOrder = async () => {
    if (!cart?.id || !selectedAddressId || !shippingCost || !estimatedDeliveryDate) {
      return message.warning('Faltan datos para confirmar el pedido.');
    }
    const body = {
      address: selectedAddressId,
      shippingCost,
      estimatedDeliveryDate: new Date(estimatedDeliveryDate).toISOString(),
    };
    try {
      await createOrder(cart.id, body);
      message.success('Pedido confirmado con éxito');
      navigate('/orders');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Ocurrió un error al confirmar el pedido.');
    }
  };

  return (
    <div className={styles.container}>
      <Tabs activeKey={tabKey} onChange={setTabKey}>
        <TabPane tab={t('cart.orderInfo')} key="1">
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
                  <Card key={item.id} className={styles.itemCard}>
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
                          {t('cart.size')}: {item.variant?.size?.name}
                        </div>
                      </Col>
                      <Col span={3}>
                        {item.discount > 0 && cart?.coupon ? (
                          <div>
                            <Text delete style={{ fontSize: '0.9rem', color: '#999' }}>
                              $
                              {item.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </Text>
                            <br />
                            <Text>
                              $
                              {item.finalPrice.toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                              })}
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
              <Input
                placeholder={t('cart.enterCoupon')}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
              <Button block onClick={() => cart && addCouponCode(cart.id, { couponCode })}>
                {t('cart.usePromoCode')}
              </Button>
              <Button
                type="primary"
                block
                size="large"
                style={{ marginTop: '1rem' }}
                onClick={() => setTabKey('2')}
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
        </TabPane>

        <TabPane
          tab={t('cart.shippingDetails')}
          key="2"
          disabled={!cart || cart.items.length === 0}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <div className={styles.addressHeader}>
                <Title level={2}>{t('cart.selectAddress')}</Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingAddress(null);
                    setOpenModal(true);
                  }}
                >
                  {t('cart.addAddress')}
                </Button>
              </div>
              <Radio.Group
                value={selectedAddressId}
                onChange={(e) => {
                  setSelectedAddressId(e.target.value);
                  const selected = user?.addresses.find((a) => a.id === e.target.value);
                  setPostalCodeInput(selected?.postalCode || '');
                }}
                style={{ width: '100%' }}
              >
                {user?.addresses.map((address) => (
                  <Card key={address.id} className={styles.addressCard}>
                    <Radio value={address.id}>
                      <Text strong>{address.street}</Text> – {address.city}, {address.province} (
                      {address.postalCode})
                    </Radio>
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
            </Col>
            <Col xs={24} md={8}>
              <Title level={4}>{t('cart.calculateShipping')}</Title>
              <Input
                placeholder={t('cart.postalCodeExample')}
                value={postalCodeInput}
                onChange={(e) => setPostalCodeInput(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <Button type="primary" block onClick={handleCalculate}>
                {t('cart.calculateShippingBtn')}
              </Button>
              {shippingCost !== null && estimatedDeliveryDate && (
                <div style={{ marginTop: '1rem' }}>
                  <Text>
                    {t('cart.shippingCost')}: <strong>${shippingCost}</strong>
                  </Text>
                  <br />
                  <Text>
                    {t('cart.estimatedDelivery')}:{' '}
                    <strong>{new Date(estimatedDeliveryDate).toLocaleDateString('es-AR')}</strong>
                  </Text>
                </div>
              )}
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={t('cart.confirm')}
          key="3"
          disabled={selectedAddressId === null && shippingCost === null}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <Title level={2}>{t('cart.summaryTitle')}</Title>
              {cartItems.length === 0 ? (
                <Empty description={t('cart.empty')} />
              ) : (
                cartItems.map((item) => (
                  <Card key={item.id} className={styles.itemCard}>
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
                          {t('cart.size')}: {item.variant?.size?.name} / {t('cart.color')}:{' '}
                          {item.variant?.color?.name}
                        </div>
                      </Col>
                      <Col span={3}>
                        {item.discount > 0 && cart?.coupon ? (
                          <div>
                            <Text delete style={{ fontSize: '0.9rem', color: '#999' }}>
                              $
                              {item.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </Text>
                            <br />
                            <Text>
                              $
                              {item.finalPrice.toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                              })}
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
              <Title level={4}>{t('cart.summaryFinal')}</Title>
              <Text>{t('cart.selectedAddress')}:</Text>
              {selectedAddressId ? (
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                  {user?.addresses.find((a) => a.id === selectedAddressId)?.street},{' '}
                  {user?.addresses.find((a) => a.id === selectedAddressId)?.city},{' '}
                  {user?.addresses.find((a) => a.id === selectedAddressId)?.province} (
                  {user?.addresses.find((a) => a.id === selectedAddressId)?.postalCode})
                </Text>
              ) : (
                <Text type="danger" style={{ display: 'block', marginBottom: 8 }}>
                  {t('cart.noAddress')}
                </Text>
              )}
              <Divider />
              <Input
                placeholder={t('cart.enterCoupon')}
                value={coupon?.code || couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ marginBottom: '1rem' }}
                disabled={!!coupon?.code}
              />
              <Button
                block
                disabled={!!coupon?.code}
                onClick={() => cart && addCouponCode(cart.id, { couponCode })}
              >
                {t('cart.usePromoCode')}
              </Button>
              {coupon?.code && (
                <Button
                  type="link"
                  danger
                  style={{ padding: 0, marginTop: 8 }}
                  onClick={() => cart && addCouponCode(cart.id, { couponCode: 'null' })}
                >
                  {t('cart.removeCoupon')}
                </Button>
              )}

              <Divider />
              <Row justify="space-between">
                <Text strong>{t('cart.subtotal')}</Text>
                <Text>${getTotal().toFixed(2)}</Text>
              </Row>
              {coupon && (
                <Row justify="space-between">
                  <Text type="secondary">{t('cart.discountApplied', { value: coupon.value })}</Text>
                  <Text type="secondary">- ${(getTotal() - getTotalFinalPrice()).toFixed(2)}</Text>
                </Row>
              )}
              <Row justify="space-between">
                <Text>{t('cart.shippingCost')}</Text>
                <Text>${shippingCost?.toFixed(2)}</Text>
              </Row>
              <Row justify="space-between">
                <Text>{t('cart.estimatedDelivery')}</Text>
                <Text>
                  {estimatedDeliveryDate
                    ? new Date(estimatedDeliveryDate).toLocaleDateString('es-AR')
                    : ''}
                </Text>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Text strong>{t('cart.totalToPay')}</Text>
                <Text strong>${(getTotalFinalPrice() + (shippingCost || 0)).toFixed(2)}</Text>
              </Row>
              <Button
                type="primary"
                block
                size="large"
                style={{ marginTop: '1rem' }}
                disabled={!selectedAddressId || !shippingCost || !estimatedDeliveryDate}
                onClick={handleConfirmOrder}
              >
                {t('cart.confirmOrder')} →
              </Button>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

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

export default CartPage;
