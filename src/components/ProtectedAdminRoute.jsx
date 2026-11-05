// src/components/ProtectedAdminRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSession } from '../utils/auth';

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const session = getAdminSession();

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
          message: 'Akses terbatas untuk pengelola. Silakan masuk terlebih dahulu.',
        }}
      />
    );
  }

  return children;
}
