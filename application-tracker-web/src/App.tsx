import React, { useEffect } from "react";
import "./App.css";
import "./styles/theme.css";
import Profile from "./components/Profile";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthState } from "./store/AuthSlice";
import PrivateRoute from "./PrivateRoute";
import { Route, Routes } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.authReducer);

  useEffect(() => {
    dispatch(fetchAuthState() as any);
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <div>
              {user ? (
                <div className="main-header">
                  <div className="header-left" />
                  <Profile user={user} />
                </div>
              ) : null}
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
