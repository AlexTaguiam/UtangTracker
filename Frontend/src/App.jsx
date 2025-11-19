import { useState } from "react";
import { Route, Routes } from "react-router";
import DashBoardPage from "./pages/DashBoardPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailePage from "./pages/CustomerDetailePage";
import AddUtangPage from "./pages/AddUtangPage";
import AllUtangPage from "./pages/AllUtangPage";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashBoardPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/customers/:id" element={<CustomerDetailePage />} />
      <Route path="/addCustomer" element={<AddUtangPage />} />
      <Route path="/allUtang" element={<AllUtangPage />} />
    </Routes>
  );
}

export default App;
