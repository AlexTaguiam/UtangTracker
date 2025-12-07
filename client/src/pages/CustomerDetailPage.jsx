import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ClipboardClock } from "lucide-react";
import axios from "axios";
import { formatCurrency } from "../utils/format";
import NavigationBar from "../components/NavigationBar";
import Goback from "../components/Goback";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    const getCustomerDetail = async () => {
      try {
        console.log("ID:", id);
        const response = await axios.get(
          `http://localhost:3000/api/customers/${id}`
        );
        console.log("API Response:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error in Customer Detail Page", error);
      }
    };
    getCustomerDetail();
  }, [id]);

  console.log(data);

  {
    return (
      <div className="bg-gray-100 font-poppins relative pb-15">
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 min-h-screen pb-24">
          <Goback />
          <div className="text-center mb-6 pt-4">
            <h1 id="customerName" className="text-3xl font-bold text-[#831843]">
              {data.name || " No records found"}
            </h1>
            <p className="text-gray-600 text-md">Utang history and actions</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#fee2e2] text-red-800 p-4 rounded-lg shadow-md flex flex-col justify-center">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 opacity-70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Unpaid
                </p>
              </div>
              <p id="overallPaid" className="text-2xl font-bold">
                {formatCurrency(data.customerTotalUnpaid)}
              </p>
            </div>

            <div className="bg-[#dcfce7] text-green-800 p-4 rounded-lg shadow-md flex flex-col justify-center">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 opacity-70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Total Paid
                </p>
              </div>
              <p id="overallPaid" className="text-2xl font-bold">
                {formatCurrency(data.customerTotalPaid)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Transaction History
            </h2>
          </div>

          {data.history?.length > 0 ? (
            data.history.map((customerHistory, index) => {
              return (
                <div
                  key={customerHistory._id || index}
                  className="transaction-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-5"
                >
                  <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-bold text-gray-700">
                        {customerHistory?.date
                          ? new Date(customerHistory?.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "No date available"}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        <p>
                          {customerHistory?.date
                            ? new Date(
                                customerHistory?.date
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "No time available"}
                        </p>
                      </div>
                    </div>
                    <div>
                      {customerHistory.status === "paid" ? (
                        <span className=" bg-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white">
                          Fully Paid
                        </span>
                      ) : customerHistory.status === "partial" ? (
                        <span className=" bg-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white">
                          Partially Paid
                        </span>
                      ) : (
                        <span className=" bg-red-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white">
                          Unpaid
                        </span>
                      )}
                    </div>
                  </div>
                  {customerHistory.products.map((product) => {
                    return (
                      <div key={product._id} className="p-4 space-y-2">
                        <div className="product-mini-card bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-100">
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm product-name">
                              {product.product}
                            </h4>
                            <p className="text-xs text-gray-500 mt-2">
                              {product.quantity} x{" "}
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                          <p className="font-bold text-gray-700 text-sm">
                            {formatCurrency(product.total)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">
                        Total Amount
                      </span>
                      <span className="font-bold text-gray-800">
                        {formatCurrency(customerHistory.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Paid</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(customerHistory.paidAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                      <span className="text-sm font-bold text-gray-700">
                        Remaining Balance
                      </span>
                      <span className="font-bold text-red-600 text-lg">
                        {formatCurrency(customerHistory.remainingBalance)}
                      </span>
                    </div>

                    <div className="flex space-x-2 mt-4 justify-end">
                      {customerHistory.status === "unpaid" ||
                      customerHistory.status === "partial" ? (
                        <Link
                          to={`/customers/${id}/payment/${customerHistory._id}`}
                          className="flex items-center text-xs font-bold bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Pay
                        </Link>
                      ) : (
                        ""
                      )}
                      <Link
                        to={`/customers/${id}/deleteHistory/${customerHistory._id}`}
                        className="flex items-center text-xs font-bold bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className=" flex flex-col items-center gap-5">
              {" "}
              <p>Your activity will show up here</p>
              <ClipboardClock size={54} />
            </div>
          )}
        </div>
        <NavigationBar />
      </div>
    );
  }
};

export default CustomerDetailPage;
