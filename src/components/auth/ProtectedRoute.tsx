import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  const { state: { isAuthenticated } } = useApp();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
