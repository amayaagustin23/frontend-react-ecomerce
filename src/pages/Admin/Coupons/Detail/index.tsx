import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  Typography,
  message,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useCoupon } from '@/context/Coupon/CouponContext';
import { CouponStatus, CouponType } from '@/types/Coupon';
import styles from './DetailPage.module.scss';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Item, useForm } = Form;

const DetailCouponPage = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { fetchCouponById, updateCouponData, coupon } = useCoupon();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const load = async () => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    }
    if (!id) return;

    await fetchCouponById(id);
  };

  useEffect(() => {
    load();
  }, [id, searchParams]);

  useEffect(() => {
    if (!coupon || coupon.id !== id) return;

    form.setFieldsValue({
      description: coupon.description,
      value: coupon.value,
      price: coupon.price,
      type: coupon.type,
      code: coupon.code,
      status: coupon.status,
      expiresAt: dayjs(coupon.expiresAt),
    });
    setLoading(false);
  }, [coupon, id]);

  const onFinish = async (values: any) => {
    if (!id) return;
    const dto = {
      ...values,
      expiresAt: values.expiresAt.toISOString(),
    };
    await updateCouponData(id, dto);
    setIsEditing(false);
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin tip={t('common.loading')} size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={3}>{t('coupons.editTitle')}</Title>
        {!isEditing && (
          <Button
            type="primary"
            onClick={() => {
              searchParams.set('edit', 'true');
              setSearchParams(searchParams);
              setIsEditing(true);
            }}
          >
            {t('actions.edit')}
          </Button>
        )}
      </Row>

      <Form form={form} layout="vertical" onFinish={onFinish} disabled={!isEditing}>
        <Row gutter={16}>
          <Col span={12}>
            <Item
              label={t('coupons.description')}
              name="description"
              rules={[{ required: true, message: t('form.required') }]}
            >
              <Input />
            </Item>
          </Col>

          <Col span={12}>
            <Item
              label={t('coupons.code')}
              name="code"
              rules={[{ required: true, message: t('form.required') }]}
            >
              <Input />
            </Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Item
              label={t('coupons.value')}
              name="value"
              rules={[{ required: true, message: t('form.required') }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Item>
          </Col>

          <Col span={12}>
            <Item
              label={t('coupons.price')}
              name="price"
              rules={[{ required: true, message: t('form.required') }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Item
              label={t('coupons.type')}
              name="type"
              rules={[{ required: true, message: t('form.required') }]}
            >
              <Select
                options={Object.values(CouponType).map((value) => ({
                  value,
                  label: t(`coupons.types.${value}`),
                }))}
              />
            </Item>
          </Col>

          <Col span={12}>
            <Item
              label={t('coupons.status')}
              name="status"
              rules={[{ required: true, message: t('form.required') }]}
            >
              <Select
                options={Object.values(CouponStatus).map((value) => ({
                  value,
                  label: t(`coupons.statuses.${value}`),
                }))}
              />
            </Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Item
              label={t('coupons.expiresAt')}
              name="expiresAt"
              rules={[{ required: true, message: t('form.required') }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Item>
          </Col>
        </Row>

        {isEditing && (
          <Row justify="end">
            <Col>
              <Item>
                <Button type="primary" htmlType="submit">
                  {t('common.actions.save')}
                </Button>
              </Item>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
};

export default DetailCouponPage;
