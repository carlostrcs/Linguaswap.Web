import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type GuestOnlyRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

export function GuestOnlyRoute({ children,   redirectTo = "/libraries" }: GuestOnlyRouteProps) {
  const location = useLocation();

  if (localStorage.getItem("linguaswap.token")) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}