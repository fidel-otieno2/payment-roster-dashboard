import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddPayment from "./pages/AddPayment";
import Statistics from "./pages/Statistics";
import UserRoleManagement from "./components/UserRoleManagement";
import ErrorBoundary from "./components/ErrorBoundary";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-payment" element={<AddPayment />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/user-management" element={<UserRoleManagement />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
