import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';
import ProtectedRoute from './ProtectedRoute';
import { PATH_ROUTE_DASHBOARD, PATH_ROUTE_HOME } from './paths';
import LayoutContainerClient from '@/components/layout/LayoutContainerClient';
import LayoutContainerAdmin from '@/components/layout/LayoutContainerAdmin';
import { useAuth } from '@/context/Auth/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  const clientRoutes = routes.filter((r) => r.layout === 'client');
  const dashboardRoutes = routes.filter((r) => r.layout === 'dashboard');
  const noLayoutRoutes = routes.filter((r) => r.layout === null);

  const isAdmin = user?.role === 'ADMIN';
  const LayoutForHome = isAdmin ? LayoutContainerAdmin : LayoutContainerClient;

  return (
    <Routes>
      {/* Home/Layout según rol */}
      <Route path={PATH_ROUTE_HOME} element={<LayoutForHome />}>
        {clientRoutes.map(({ path, element, isPrivate }) => (
          <Route
            key={path}
            path={path}
            element={isPrivate ? <ProtectedRoute>{element}</ProtectedRoute> : element}
          />
        ))}
      </Route>

      {/* Dashboard fijo (solo visible si es ADMIN) */}
      {isAdmin && (
        <Route path={PATH_ROUTE_DASHBOARD} element={<LayoutContainerAdmin />}>
          {dashboardRoutes.map(({ path, element, isPrivate }) => {
            const childPath = path.replace(`${PATH_ROUTE_DASHBOARD}`, '').replace(/^\//, '') || '';
            return (
              <Route
                key={path}
                path={childPath}
                element={isPrivate ? <ProtectedRoute>{element}</ProtectedRoute> : element}
              />
            );
          })}
        </Route>
      )}

      {/* Rutas sin layout */}
      {noLayoutRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={PATH_ROUTE_HOME} />} />
    </Routes>
  );
};

export default AppRoutes;
