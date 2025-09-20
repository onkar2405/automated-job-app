import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute component to protect private routes
 * @param param0 - children elements to render
 * @returns PrivateRoute or redirect to login
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useSelector((state: any) => state.authReducer);

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
