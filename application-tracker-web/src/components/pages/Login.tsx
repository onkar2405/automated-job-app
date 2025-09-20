import React from "react";

const Login: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Please log in to continue</h2>
      <a
        href="http://localhost:5000/auth/google"
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
