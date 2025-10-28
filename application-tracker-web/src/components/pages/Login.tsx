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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Please log in to continue</h2>
      <a
        href="http://localhost:5000/login"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
          textDecoration: "none",
        }}
      >
        Login with Google
      </a>
    </div>
  );
};

export default Login;
