import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';
import ProtectedRoute from './ProtectedRoute';
import { PATH_ROUTE_PANEL_DASHBOARD, PATH_ROUTE_HOME } from './paths';
import LayoutContainerClient from '@/components/layout/LayoutContainerClient';
import LayoutContainerAdmin from '@/components/layout/LayoutContainerAdmin';
import { useAuth } from '@/context/Auth/AuthContext';
import DashboardPage from '@/pages/Admin/Dashboard';

const AppRoutes = () => {
  const { user } = useAuth();

  if (user === undefined) return null;

  const clientRoutes = routes.filter((r) => r.layout === 'client');
  const dashboardRoutes = routes.filter((r) => r.layout === 'dashboard');
  const noLayoutRoutes = routes.filter((r) => r.layout === null);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <Routes>
      {isAdmin && (
        <Route path={PATH_ROUTE_PANEL_DASHBOARD} element={<LayoutContainerAdmin />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {dashboardRoutes.map(({ path, element, isPrivate }) => {
            if (path === '') return null;
            return (
              <Route
                key={path}
                path={path}
                element={isPrivate ? <ProtectedRoute>{element}</ProtectedRoute> : element}
              />
            );
          })}
          {/* fallback solo dentro del layout admin */}
          <Route path="*" element={<Navigate to="" replace />} />
        </Route>
      )}

      {!isAdmin && (
        <Route path={PATH_ROUTE_HOME} element={<LayoutContainerClient />}>
          {clientRoutes.map(({ path, element, isPrivate }) => (
            <Route
              key={path}
              path={path}
              element={isPrivate ? <ProtectedRoute>{element}</ProtectedRoute> : element}
            />
          ))}
          {/* fallback solo dentro del layout client */}
          <Route path="*" element={<Navigate to="" replace />} />
        </Route>
      )}

      {/* Rutas sin layout */}
      {noLayoutRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
