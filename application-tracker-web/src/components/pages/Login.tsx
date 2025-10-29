import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store/ApplicationStore";

const Login: React.FC = () => {
  const { user, loading } = useSelector(
    (state: RootState) => state.authReducer
  );

  // Redirect to dashboard if user is already logged in
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <h2>Please log in to continue</h2>
      <a href="http://localhost:5000/login" className="google-signin-button">
        <img src="/google-logo.svg" alt="Google logo" className="google-logo" />
        <span>Sign in with Google</span>
      </a>
    </div>
  );
};

export default Login;
