import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { formatCurrency, formatNumber } from "../utils/format";

const PaymentPage = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [amount, setAmount] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  useEffect(() => {
    const getPaymentCustomerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/${id}/transactions`
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log("Error fetching in payment page", error);
      }
    };
    getPaymentCustomerDetails();
  }, []);

  const remainingBalance = data.transactions?.[0]?.remainingBalance ?? 0;

  useEffect(() => {
    if (!amount || amount === 0) {
      setIsInvalid(false);
    } else if (amount < 0 || amount > remainingBalance) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [amount, remainingBalance]);

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <div className="text-center mb-6 pt-4">
          <h1 className="text-2xl font-bold text-sari-maroon">
            Process Payment
          </h1>
          <p className="text-gray-500 text-sm">Update transaction record</p>
        </div>
        {data &&
          data.transactions?.map((customer) => {
            return (
              <div key={customer.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex justify-between items-start relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-sari-maroon"></div>

                  <div className="flex w-full justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                        Customer
                      </p>
                      <h2
                        id="custName"
                        className="text-lg font-bold text-gray-800 leading-tight"
                      >
                        {customer.customerName}
                      </h2>
                      <div className="flex flex-col mt-1 text-xs text-gray-500">
                        <div className="flex  mt-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
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
                          <span>
                            {" "}
                            {customer?.date
                              ? new Date(customer?.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "No date available"}
                          </span>
                        </div>
                        <div className="mt-2 flex">
                          <span className="mr-1">•</span>
                          <span
                            id="transId"
                            className="font-mono text-gray-400"
                          >
                            ID:#{customer.customerId}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span>
                        {customer.status === "paid" ? (
                          <span className=" bg-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white">
                            Fully Paid
                          </span>
                        ) : customer.status === "partial" ? (
                          <span className=" bg-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white">
                            Partially Paid
                          </span>
                        ) : (
                          <span className=" bg-red-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white">
                            Unpaid
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Transaction Summary
                    </h3>
                  </div>
                  {customer.transactionDetails.products?.map((product) => {
                    return (
                      <div
                        key={product._id}
                        className="p-4 space-y-2 border-b border-dashed border-gray-200"
                      >
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 mb-1">
                              {product.product}
                            </span>
                            <span className="text-xs text-gray-400 ml-1 mb-1">
                              Price: {formatCurrency(product.price)}
                            </span>
                            <span className="text-xs text-gray-400 ml-1 mb-1">
                              Quantity:{product.quantity}
                            </span>
                          </div>
                          <div className="text-right font-medium text-gray-600">
                            {formatCurrency(product.total)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="p-4 bg-white">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Total Amount</span>
                      <span id="displayTotal" className="font-medium">
                        {formatCurrency(customer.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      <span>Already Paid</span>
                      <span
                        id="displayPaid"
                        className="font-medium text-green-600"
                      >
                        {formatCurrency(customer.paidAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-sm font-bold text-gray-700">
                        Remaining Balance
                      </span>
                      <span
                        id="displayBalance"
                        className="text-xl font-bold text-[#831843]"
                      >
                        {formatCurrency(customer.remainingBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        <form
          id="paymentForm"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Payment submitted");
          }}
          className="bg-white rounded-xl shadow-lg p-5 border border-sari-green/20"
        >
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Enter Amount to Pay
          </label>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 font-bold text-lg">₱</span>
            </div>
            <input
              type="number"
              id="paymentInput"
              placeholder="0.00"
              className="block w-full pl-10 pr-4 py-4 text-2xl font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sari-green focus:border-sari-green transition-all"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
            />
          </div>

          <div
            id="projectionBox"
            className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-100 transition-all"
          >
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">
              Projected Result
            </p>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs text-gray-400 block">New Balance</span>
                <span
                  id="newBalanceDisplay"
                  className="font-bold text-gray-700"
                >
                  {amount &&
                  data.transactions?.[0].remainingBalance < amount ? (
                    <p className="text-xs text-red-500 font-medium mt-2">
                      {`Input Exceeds Balance (${data.transactions?.[0].remainingBalance})`}
                    </p>
                  ) : amount < 0 ? (
                    <p className="text-xs text-red-500 font-medium mt-2 ">
                      Amount cannot be negative
                    </p>
                  ) : (
                    amount && data.transactions?.[0].remainingBalance - amount
                  )}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">New Status</span>

                {!amount || amount === 0 ? (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-gray-200 text-gray-500">
                    {" "}
                    <p> waiting...</p>
                  </span>
                ) : Number(amount) ===
                  data.transactions?.[0].remainingBalance ? (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-green-500 text-white">
                    <p>Paid</p>
                  </span>
                ) : amount < 0 ||
                  amount > data.transactions?.[0].remainingBalance ? (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white">
                    <p>Invalid</p>
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-yellow-500 text-white">
                    <p>Partial</p>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pointer-events-none">
            <Link
              to={`/customers/${id}`}
              type="button"
              className="py-3 px-4 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              disabled={isInvalid}
              type="submit"
              id="submitBtn"
              className="py-3 px-4 rounded-lg font-bold text-white bg-[#16a34a] hover:bg-sari-green-dark shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
