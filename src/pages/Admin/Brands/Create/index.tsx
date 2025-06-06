import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './CreatePage.module.scss';
import { useBrand } from '@/context/Brand/BrandContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Item, useForm, useWatch } = Form;

const CreateBrandPage = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const nameValue = useWatch('name', form);
  const { createBrandData } = useBrand();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { name: string }) => {
    setLoading(true);
    await createBrandData(values);
    setLoading(false);
    navigate(-1);
    form.resetFields();
  };

  return (
    <div className={styles.container}>
      <Title level={3}>{t('brands.createTitle')}</Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Item
          label={t('brands.name')}
          name="name"
          rules={[{ required: true, message: t('brands.nameRequired') }]}
        >
          <Input placeholder={t('brands.namePlaceholder')} />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit" disabled={!nameValue} loading={loading}>
            {t('brands.save')}
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default CreateBrandPage;
