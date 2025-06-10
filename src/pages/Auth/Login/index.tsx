import React, { useState } from 'react';
import { Input, Button, Typography, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { login } from '@/services/calls/auth.service';
import { useAuth } from '@/context/Auth/AuthContext';
import { useTranslation } from 'react-i18next';
import styles from './LoginPage.module.scss';
import { useCart } from '@/context/Cart/CartContext';
import {
  PATH_ROUTE_PANEL_DASHBOARD,
  PATH_ROUTE_HOME,
  PATH_ROUTE_RECOVERY_PASSWORD,
  PATH_ROUTE_REGISTER,
} from '@/router/paths';

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useAuth();
  const { fetchCart } = useCart();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });
      const { token, user } = response.data;

      Cookies.set('access_token', token, {
        path: '/',
        sameSite: 'strict',
      });

      setUser(user);
      setIsLogin(true);
      message.success(t('auth.login.success'));

      if (user.role === 'ADMIN') {
        navigate(PATH_ROUTE_PANEL_DASHBOARD, { replace: true });
      } else {
        fetchCart();
        navigate(PATH_ROUTE_HOME, { replace: true });
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.card}>
        <div className="text-center mb-6">
          <Title level={2} className={styles.title}>
            {t('auth.login.title')}
          </Title>
          <Text type="secondary">{t('auth.login.subtitle')}</Text>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div>
            <Text strong>{t('auth.login.email')}</Text>
            <Input
              size="large"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.login.emailPlaceholder')}
              required
            />
          </div>

          <div>
            <Text strong>{t('auth.login.password')}</Text>
            <Input.Password
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.login.passwordPlaceholder')}
              required
            />
          </div>

          <div className={styles.textRight}>
            <Link href={PATH_ROUTE_RECOVERY_PASSWORD}>{t('auth.login.forgotPassword')}</Link>
          </div>

          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            {t('auth.login.button')}
          </Button>

          <Button
            type="default"
            size="large"
            block
            onClick={() => navigate(PATH_ROUTE_HOME)}
            className={styles.backButton}
          >
            {t('actions.backHome', 'Volver al inicio')}
          </Button>
        </form>

        <div className={styles.footerText}>
          <Text>
            {t('auth.login.noAccount')}{' '}
            <Link href={PATH_ROUTE_REGISTER}>{t('auth.login.register')}</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
