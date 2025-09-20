import React, { useEffect } from "react";
import "./App.css";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthState } from "./store/AuthSlice";
import PrivateRoute from "./PrivateRoute";
import { Route, Routes } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: any) => state.authReducer);

  useEffect(() => {
    dispatch(fetchAuthState() as any);
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <div>
              <div>{user ? <h2>Welcome {user.name} </h2> : null}</div>
              <Dashboard />
            </div>
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
