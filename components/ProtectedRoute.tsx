// frontend/src/components/auth/ProtectedRoute.tsx
import { useAppSelector } from "@/store/hooks/store";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
  children?: ReactNode;
}

export function ProtectedRoute({
  allowedRoles = [],
  redirectTo = "/auth/signin",
  children,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Save the location they tried to access
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user?.role as string)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}