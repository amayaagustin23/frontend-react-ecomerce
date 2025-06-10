import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './RecoveryPasswordPage.module.scss';
import { useAuth } from '@/context/Auth/AuthContext';
import { PATH_ROUTE_HOME } from '@/router/paths';
import { useMessageApi } from '@/context/Message/MessageContext';

const { Title } = Typography;

const RecoveryPasswordPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { recoverPassword } = useAuth();
  const navigate = useNavigate();
  const message = useMessageApi();

  const handleFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await recoverPassword(values);
      setSubmitted(true);
    } catch (error) {
      message.error('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Title level={2}>{t('recovery.title', 'Recuperar contraseña')}</Title>

      {submitted ? (
        <Alert
          type="success"
          showIcon
          message={t('recovery.success', 'Revisá tu correo para continuar con el proceso.')}
        />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="email"
            label={t('fields.email', 'Correo electrónico')}
            rules={[{ required: true, type: 'email', message: t('errors.email') }]}
          >
            <Input prefix={<MailOutlined />} placeholder="ejemplo@correo.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t('actions.send', 'Enviar correo')}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="default" block onClick={() => navigate(PATH_ROUTE_HOME)}>
              {t('actions.backHome', 'Volver al inicio')}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default RecoveryPasswordPage;
