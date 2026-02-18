import React, { useState } from "react";
import Goback from "../components/Goback";
import LogoutConfirmation from "../components/LogoutConfirmationUI";
const SetttingsPage = () => {
  const [open, setOpen] = useState(false);

  if (open) {
    return <LogoutConfirmation onTrigger={() => setOpen((prev) => !prev)} />;
  }
  return (
    <div className="flex justify-center items-center bg-gray-100 font-poppins pb-15">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 min-h-screen flex  flex-col">
        <Goback />
        <header className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold text-[#831843]">Settings</h1>
          <p className="text-gray-600 text-md"> Manage Your Account</p>
        </header>
        <main>
          <div className=" flex  bg-white p-5 rounded-2xl shadow-lg mb-5">
            <div className="bg-yellow-200 rounded-full h-20 w-20 flex items-center justify-center shadow-xl border-amber-100">
              <div className="text-4xl">🧑‍🍳</div>
            </div>
            <div className="ml-3">
              <h1 className="font-bold text-xl">Mama's Store</h1>
              <p className="text-sm text-gray-600 p-1">Store Owner</p>
              <p className="font-semibold text-sm text-green-600 p-1">
                Edit Profile
              </p>
            </div>
          </div>
        </main>
        <div className=" flex flex-col bg-white rounded-2xl shadow-lg">
          <h1 className="bg-gray-200 p-2 rounded-t-2xl font-bold text-gray-400">
            GENERAL
          </h1>

          <div className="flex p-2 m-2">
            <div className="p-2">🌙</div>
            <div className="p-2 font-medium">Appearance</div>
          </div>
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="pt-3 pb-3 mt-5 bg-red-200 text-[#831843] font-bold text-xl rounded-2xl shadow-lg"
        >
          Log out
        </button>

        <p className="text-gray-400 text-center m-5">Version 1.0.0.</p>
      </div>
    </div>
  );
};

export default SetttingsPage;
