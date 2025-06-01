import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { routes } from './routes';
import ProtectedRoute from './ProtectedRoute';
import LayoutContainer from '@/components/Layout/LayoutContainer';
import { PATH_ROUTE_LOGIN } from './paths';

const AppRoutes = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === PATH_ROUTE_LOGIN;

  return (
    <Routes>
      {!isLoginPage ? (
        <Route path="/" element={<LayoutContainer />}>
          {routes.map(({ path, element, isPrivate }) => (
            <Route
              key={path}
              path={path}
              element={isPrivate ? <ProtectedRoute>{element}</ProtectedRoute> : element}
            />
          ))}
        </Route>
      ) : (
        routes
          .filter((route) => route.path === PATH_ROUTE_LOGIN)
          .map(({ path, element }) => <Route key={path} path={path} element={element} />)
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
