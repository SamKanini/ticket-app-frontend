import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to register */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/logout" element={<Logout />} />; */}
        {/* <Route path="/register" element={<RegisterAndLogout />} /> */}
        <Route path="*" element={<NotFound />}></Route>;
      </Routes>
    </BrowserRouter>
  );
}

export default App;
