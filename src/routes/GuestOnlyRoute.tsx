import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";

type GuestOnlyRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

export function GuestOnlyRoute({ children,   redirectTo = "/libraries" }: GuestOnlyRouteProps) {
  const location = useLocation();

  if (isAuthenticated()) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}