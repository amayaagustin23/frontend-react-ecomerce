import React, { useEffect, useState, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '@/services/calls/auth.service';
import { PATH_ROUTE_LOGIN } from './paths';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMe();
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null;

  return authorized ? children : <Navigate to={PATH_ROUTE_LOGIN} />;
};

export default ProtectedRoute;
