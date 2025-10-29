import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "./store/ApplicationStore";
import { User } from "./types/user";

interface PrivateRouteProps {
  children: React.ReactNode;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authState = useSelector<RootState, AuthState>(
    (state) => state.authReducer
  );
  const { user } = authState;

  return user ? <>{children}</> : <Navigate to="/login" replace={true} />;
};

export default PrivateRoute;
