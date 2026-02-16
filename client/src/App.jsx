import { useState } from "react";
import { Route, Routes } from "react-router";
import DashBoardPage from "./pages/DashBoardPage";
import AllCustomersPage from "./pages/AllCustomersPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import AddUtangPage from "./pages/AddUtangPage";
import AllUtangPage from "./pages/AllUtangPage";
import DeleteConfirmationPage from "./pages/DeleteConfirmationPage";
import PaymentPage from "./pages/PaymentPage";
import DeleteCustomerConfirmationPage from "./pages/DeleteCustomerConfirmationPage";
import LoginForm from "./pages/LoginPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<DashBoardPage />} />
          <Route path="/customers" element={<AllCustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/addCustomer" element={<AddUtangPage />} />
          <Route path="/allUtang" element={<AllUtangPage />} />
          <Route
            path="/customers/:id/deleteHistory/:deleteId"
            element={<DeleteConfirmationPage />}
          />
          <Route
            path="/deleteCustomers/:id"
            element={<DeleteCustomerConfirmationPage />}
          />

          <Route
            path="/customers/:id/payment/:paymentId"
            element={<PaymentPage />}
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
