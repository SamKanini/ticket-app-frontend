import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoutes";
import { ACCESS_TOKEN } from "./constants";

function Logout() {
  localStorage.clear();
  return <Navigate to={"/login"} />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}
function App() {
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);

  return (
    <BrowserRouter>
      <Routes>
        {/* check if authenticated go to home if not go to register */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/register" replace />
            )
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/register" element={<RegisterAndLogout />} /> */}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
