import React, { useState } from 'react';
import { Input, Button, Typography, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { login } from '@/services/calls/auth.service';
import { useAuth } from '@/context/Auth/AuthContext';

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });
      const { token, user } = response.data;

      Cookies.set('access_token', token, { path: '/' });
      setUser(user);
      setIsLogin(true);
      message.success('Sesión iniciada con éxito');
      navigate('/');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md" style={{ margin: '10rem 30rem' }}>
        <div className="text-center mb-6">
          <Title level={2} className="!mb-1">
            Bienvenido 👋
          </Title>
          <Text type="secondary">Iniciá sesión para continuar</Text>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Text strong>Email</Text>
            <Input
              size="large"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div>
            <Text strong>Contraseña</Text>
            <Input.Password
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="text-right">
            <Link href="/recuperar">¿Olvidaste tu contraseña?</Link>
          </div>

          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Iniciar sesión
          </Button>
        </form>

        <div className="text-center mt-6">
          <Text>
            ¿No tenés cuenta? <Link href="/register">Registrate</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
