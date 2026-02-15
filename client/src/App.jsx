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

function App() {
  return (
    <div>
      <Routes>
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
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default App;
