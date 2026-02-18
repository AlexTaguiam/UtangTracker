import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@headlessui/react";

const LogoutConfirmation = ({ onTrigger }) => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("User Log out Successfull");
      console.log("User Logged Out Successfully");
    } catch (error) {
      toast.error("User log out failed");
      console.log("erro handling logout", error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Log out from This Account?
        </h2>

        <p className="text-gray-700 mb-6">
          Are you sure you want to log out? You will need to enter your password
          to log back in.
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={onTrigger}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-400 transition"
          >
            Cancel
          </Button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
