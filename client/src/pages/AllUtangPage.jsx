import React from "react";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import NavigationBar from "../components/NavigationBar";
import Goback from "../components/Goback";
import api from "../services/api";

const AllUtangPage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await api.get("/allCustomersUtang");
        console.log("API Response:", response);
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.log("Error in getting Customer", error.message);
      }
    };
    getCustomer();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (!value) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((customer) => {
      return customer.name.toLowerCase().includes(value);
    });

    setFilteredData(filtered);
  };

  console.log(filteredData);

  return (
    <div className="bg-gray-100 font-poppins pb-20">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 min-h-screen">
        <Goback />
        <div className="text-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-[#831843]">All Utangs</h1>
          <p className="text-gray-600 text-md">
            Master list of all transactions
          </p>
        </div>
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="block w-full rounded-lg border-gray-300 bg-white shadow-sm pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-sari-green focus:border-transparent"
            type="text"
            placeholder="Seach by name..."
            value={search}
            onChange={(e) => handleSearch(e)}
          />
        </div>
        {filteredData &&
          filteredData.map((customer) => {
            return (
              <Link
                key={customer._id}
                to={`/customers/${customer._id}`}
                className=" mt-5 block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden group"
              >
                {/* Header */}
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {customer?.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {customer?.compiledHistory[0]?.date
                        ? new Date(
                            customer?.compiledHistory[0]?.date,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No date available"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mr-2 Status`}
                    >
                      View Customer
                    </span>
                    {/* Chevron Icon indicating navigation */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 group-hover:text-sari-maroon transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Footer / Summary */}
                <div className="px-4 py-3 bg-white border-t border-gray-100 flex justify-between items-end">
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-500">
                      Paid
                    </p>
                    <p className="text-xl font-bold text-[#16a34a] ">
                      {formatCurrency(
                        customer?.compiledHistory.reduce(
                          (acc, curr) => acc + curr.paidAmount,
                          0,
                        ),
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs  uppercase font-bold text-gray-500">
                      Balance
                    </p>
                    <p className="text-xl font-bold text-[#831843]">
                      {formatCurrency(
                        customer?.compiledHistory.reduce(
                          (acc, curr) => acc + curr.remainingBalance,
                          0,
                        ),
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <NavigationBar />
    </div>
  );
};

export default AllUtangPage;
