import axios from "axios";
import { Search, Eye, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format";

const AllCustomersPage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/customers");
        console.log("API Response:", response.data);
        setData(response.data.formatted);
        setFilteredData(response.data.formatted);
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

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100 font-poppins">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 min-h-screen flex  flex-col">
        <header className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold text-[#831843]">Customers</h1>
          <p className="text-gray-600 text-md"> Track Customers easily</p>
        </header>
        <main>
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
          {filteredData.length === 0 ? (
            <div className=" flex flex-col items-center gap-5">
              <p>{`No customer found named ${search}`}</p>
              <SearchX size={54} />
            </div>
          ) : (
            <div>
              {filteredData &&
                filteredData.map((customer) => {
                  return (
                    <div
                      key={customer._id}
                      className="customer-card bg-white rounded-lg shadow-md p-4 flex justify-between items-center transition-all duration-150 mt-5 mb-5"
                    >
                      <div>
                        <h3 className="customer-name font-bold text-lg text-gray-800">
                          {customer.name}
                        </h3>

                        {customer.status === "paid" ? (
                          <p className="text-sm font-semibold bg-[#16a34a] p-1.5 mt-2 text-white rounded-md inline-block">
                            Fully Paid
                          </p>
                        ) : customer.status === "partial" ? (
                          <div className="mt-2">
                            <p className="text-sm font-semibold bg-[#eab308] p-1.5 text-white rounded-md inline-block">
                              Partial
                            </p>
                            <p className="text-sm font-medium text-gray-700 mt-1">
                              Remaining:
                              {formatCurrency(customer.remainingBalance) ||
                                formatCurrency(customer.totalUnpaid)}
                            </p>
                          </div>
                        ) : customer.status === "unpaid" ? (
                          <div className="mt-2">
                            <p className="text-sm font-semibold bg-[#dc2626] p-1.5 text-white rounded-md inline-block">
                              Unpaid
                            </p>
                            <p className="text-sm font-medium text-gray-700 mt-1">
                              Balance:
                              {formatCurrency(customer.remainingBalance) ||
                                formatCurrency(customer.totalUnpaid)}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <p className="text-sm font-semibold bg-gray-500 p-1.5 text-white rounded-md inline-block">
                              No records found
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <Link to={`${customer._id}`}>
                          {" "}
                          <Eye
                            size={54}
                            className="bg-[#2563eb] text-white p-2 rounded-full hover:bg-blue-700 transition-all cursor-pointer"
                          />
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllCustomersPage;
