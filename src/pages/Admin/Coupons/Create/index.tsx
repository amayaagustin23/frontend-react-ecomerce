import React from 'react';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { CreateCouponDto, CouponType, CouponStatus } from '@/types/Coupon';
import { useCoupon } from '@/context/Coupon/CouponContext';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.scss';

const { Item, useForm } = Form;
const { Title } = Typography;

const CreateCouponPage = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const { createCouponData } = useCoupon();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const dto: CreateCouponDto = {
      ...values,
      expiresAt: values.expiresAt.toISOString(),
    };
    createCouponData(dto);
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>
        {t('coupons.createTitle')}
      </Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
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
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Item>
          </Col>
        </Row>

        <Row justify="end">
          <Col>
            <Item>
              <Button type="primary" htmlType="submit">
                {t('form.submit')}
              </Button>
            </Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateCouponPage;
