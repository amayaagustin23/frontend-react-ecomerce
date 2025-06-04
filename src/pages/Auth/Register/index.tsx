import React, { useState, useRef } from 'react';
import { Form, Input, Button, Typography, Alert, AutoComplete, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/Auth/AuthContext';
import styles from './RegisterPage.module.scss';
import { RegisterUserDto } from '@/types/Auth';
import { getAutocomplete, getPlaceDetails } from '@/services/calls/googlePlaces.service';
import { PATH_ROUTE_LOGIN } from '@/router/paths';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';

const { Title } = Typography;
const { Item } = Form;

const RegisterPage = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [options, setOptions] = useState<{ value: string; placeId: string }[]>([]);
  const navigate = useNavigate();
  const { register } = useAuth();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    if (value.length < 4) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await getAutocomplete(value);
        const predictions = res.data || [];
        const formatted = predictions.map((p: any) => ({
          value: p.description,
          placeId: p.place_id,
        }));
        setOptions(formatted);
      } catch (err) {
        console.error(err);
      }
    }, 300);
  };

  const handleSelect = async (_: string, option: any) => {
    try {
      const res = await getPlaceDetails(option.placeId);
      const data = res.data;

      form.setFieldsValue({
        address: {
          street: data.formattedAddress,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
          lat: data.lat,
          lng: data.lng,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onFinish = async (values: RegisterUserDto) => {
    setLoading(true);
    setServerError(null);
    try {
      await register(values);
      navigate(PATH_ROUTE_LOGIN);
    } catch (err: any) {
      const msg = err.response?.data?.message || t('errors.unknownError');
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Title level={2}>{t('register.title')}</Title>

      {serverError && (
        <Alert
          message={t('register.errorTitle')}
          description={serverError}
          type="error"
          showIcon
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Title level={4}>{t('register.credentials')}</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Item
              name="email"
              label={t('fields.email')}
              rules={[{ required: true, type: 'email', message: t('errors.email') }]}
            >
              <Input />
            </Item>
          </Col>
          <Col span={12}>
            <Item
              name="password"
              label={t('fields.password')}
              rules={[
                { required: true, message: t('errors.required') },
                { min: 8, message: t('errors.passwordLength') },
                {
                  pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                  message: t('errors.passwordFormat'),
                },
              ]}
            >
              <Input.Password />
            </Item>
          </Col>
        </Row>

        <Title level={4}>{t('register.person')}</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Item
              name={['person', 'name']}
              label={t('fields.name')}
              rules={[{ required: true, message: t('errors.required') }]}
            >
              <Input />
            </Item>
          </Col>
          <Col span={8}>
            <Item name={['person', 'phone']} label={t('fields.phone')}>
              <Input />
            </Item>
          </Col>
          <Col span={8}>
            <Item name={['person', 'cuitOrDni']} label={t('fields.cuitOrDni')}>
              <Input />
            </Item>
          </Col>
        </Row>

        <Title level={4}>{t('register.address')}</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Item
              name={['address', 'street']}
              label={t('fields.street')}
              rules={[{ required: true, message: t('errors.required') }]}
            >
              <AutoComplete
                options={options}
                onSearch={handleSearch}
                onSelect={handleSelect}
                placeholder={t('fields.street')}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item name={['address', 'city']} label={t('fields.city')}>
              <Input />
            </Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Item name={['address', 'province']} label={t('fields.province')}>
              <Input />
            </Item>
          </Col>
          <Col span={12}>
            <Item name={['address', 'postalCode']} label={t('fields.postalCode')}>
              <Input />
            </Item>
          </Col>
        </Row>

        {/* Campos ocultos */}
        <Item name={['address', 'lat']} hidden>
          <Input />
        </Item>
        <Item name={['address', 'lng']} hidden>
          <Input />
        </Item>

        <Item shouldUpdate>
          {() => {
            const hasErrors = form.getFieldsError().some((field) => field.errors.length > 0);
            const touched = form.isFieldsTouched(true);
            return (
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!touched || hasErrors}
                block
              >
                {t('actions.register')}
              </Button>
            );
          }}
        </Item>

        <Item>
          <Button type="default" onClick={() => navigate(PATH_ROUTE_LOGIN)} block>
            {t('actions.backToLogin', 'Volver al inicio')}
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
