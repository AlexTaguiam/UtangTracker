import { useState } from "react";
import { Route, Routes } from "react-router";
import DashBoardPage from "./pages/DashBoardPage";
import AllCustomersPage from "./pages/AllCustomersPage";
import CustomerDetailPage from "./pages/CustomerDetaiePage";
import AddUtangPage from "./pages/AddUtangPage";
import AllUtangPage from "./pages/AllUtangPage";
import toast from "react-hot-toast";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DashBoardPage />} />
        <Route path="/allCustomers" element={<AllCustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/addCustomer" element={<AddUtangPage />} />
        <Route path="/allUtang" element={<AllUtangPage />} />
      </Routes>
    </div>
  );
}

export default App;
