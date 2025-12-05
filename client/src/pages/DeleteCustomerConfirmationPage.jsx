import { Link, useNavigate, useParams } from "react-router-dom";
import React from "react";
import toast from "react-hot-toast";
import axios from "axios";

const DeleteCustomerConfirmationPage = () => {
  const { id } = useParams();
  const backToCustomers = useNavigate();
  const handleDeleteCustomer = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/customers/${id}`
      );
      toast.success("Customer successfully deleted");
      console.log(response.data, "Successfully deleted");
      backToCustomers("/customers");
    } catch (error) {
      console.error("Error  in deleting customer", error);
      toast.error("Failed to delete Customer");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Delete Customer</h2>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this customer? This action cannot be
          undone.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to={"/customers"}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-400 transition"
          >
            Cancel
          </Link>
          <button
            onClick={handleDeleteCustomer}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomerConfirmationPage;
