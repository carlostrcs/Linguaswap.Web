import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type PrivateRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

export function PrivateRoute({
  children,
  redirectTo = "/login"
}: PrivateRouteProps) {
  const location = useLocation();

  if (!localStorage.getItem("linguaswap.token")) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}