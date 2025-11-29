import React from "react";

const PaymentPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div class="w-full max-w-md mx-auto p-4 sm:p-6">
        <div class="text-center mb-6 pt-4">
          <h1 class="text-2xl font-bold text-sari-maroon">Process Payment</h1>
          <p class="text-gray-500 text-sm">Update transaction record</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex justify-between items-start relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-sari-maroon"></div>

          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
              Customer
            </p>
            <h2
              id="custName"
              className="text-lg font-bold text-gray-800 leading-tight"
            >
              Juan Dela Cruz
            </h2>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span id="transDate">Nov 23, 2025</span>
              <span className="mx-2">•</span>
              <span id="transId" className="font-mono text-gray-400">
                ID: #82e1...225
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              id="currentStatusBadge"
              className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"
            >
              Unpaid
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
