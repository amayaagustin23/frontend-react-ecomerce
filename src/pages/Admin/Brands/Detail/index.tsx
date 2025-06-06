import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Row, Col, Spin, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useBrand } from '@/context/Brand/BrandContext';
import styles from './DetailPage.module.scss';

const { Title } = Typography;
const { useForm, Item } = Form;

const DetailBrandPage = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { brandDetails, fetchBrandById, updateBrandData } = useBrand();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const load = async () => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    }
    if (!id) return;

    await fetchBrandById(id);
  };
  useEffect(() => {
    load();
  }, [id, searchParams]);

  useEffect(() => {
    if (!brandDetails || brandDetails.id !== id) return;

    form.setFieldsValue({ name: brandDetails.name });
    setLoading(false);
  }, [brandDetails, id]);

  const onFinish = async (values: { name: string }) => {
    if (id) {
      await updateBrandData(id, values);
      setIsEditing(false);
      navigate(-1);
    }
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
        <Title level={3}>{t('brands.editTitle')}</Title>
        {!isEditing && (
          <Button
            type="primary"
            onClick={() => {
              searchParams.set('edit', 'true');
              setSearchParams(searchParams);
              setIsEditing(true);
            }}
          >
            {t('brands.edit')}
          </Button>
        )}
      </Row>

      <Form form={form} layout="vertical" onFinish={onFinish} disabled={!isEditing}>
        <Item
          name="name"
          label={t('brands.name')}
          rules={[{ required: true, message: t('brands.nameRequired') }]}
        >
          <Input placeholder={t('brands.namePlaceholder')} />
        </Item>

        {isEditing && (
          <Item>
            <Button type="primary" htmlType="submit">
              {t('common.actions.save')}
            </Button>
          </Item>
        )}
      </Form>
    </div>
  );
};

export default DetailBrandPage;
