import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ResetPasswordPage.module.scss';
import { useAuth } from '@/context/Auth/AuthContext';
import { PATH_ROUTE_HOME } from '@/router/paths';

const { Title } = Typography;

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { token } = useParams();
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleFinish = async (values: { password: string; confirmPassword: string }) => {
    setLoading(true);
    if (token) {
      await resetPassword({
        password: values.password,
        confirmPassword: values.confirmPassword,
        token,
      });
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Title level={2}>{t('reset.title', 'Restablecer contraseña')}</Title>

      {submitted ? (
        <>
          <Alert
            type="success"
            showIcon
            message={t('reset.success', 'Contraseña actualizada correctamente.')}
          />
          <Button
            type="default"
            style={{ marginTop: '1rem' }}
            block
            onClick={() => navigate(PATH_ROUTE_HOME)}
          >
            {t('actions.backHome', 'Volver al inicio')}
          </Button>
        </>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="password"
            label={t('fields.password', 'Nueva contraseña')}
            rules={[
              { required: true, message: t('errors.required') },
              { min: 8, message: t('errors.passwordLength') },
              {
                pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                message: t('errors.passwordFormat'),
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="********" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={t('fields.confirmPassword', 'Confirmar contraseña')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('errors.required') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t('errors.passwordMatch', 'Las contraseñas no coinciden.'))
                  );
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="********" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t('actions.resetPassword', 'Restablecer')}
            </Button>
          </Form.Item>

          <Button type="default" block onClick={() => navigate(PATH_ROUTE_HOME)}>
            {t('actions.backHome', 'Volver al inicio')}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
