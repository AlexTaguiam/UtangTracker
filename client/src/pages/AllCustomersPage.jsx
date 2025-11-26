import axios from "axios";
import { Search, Eye } from "lucide-react";
import { useEffect, useState } from "react";

const AllCustomersPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/customers");
        console.log("API Response:", response.data);
        setData(response.data.formatted);
      } catch (error) {
        console.log("Error in getting Customer", error.message);
      }
    };
    getCustomer();
  }, []);

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100 font-poppins">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 min-h-screen flex  flex-col">
        <header>
          <section className="text-center mb-8 pt-4">
            <h1 className="text-3xl font-bold text-[#831843]">Customer</h1>
            <p className="text-gray-600 text-md"> Track Customer easily</p>
          </section>
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
            />
          </div>
          <div>
            {data &&
              data.map((customer, index) => {
                return (
                  <div
                    key={index}
                    className="customer-card bg-white rounded-lg shadow-md p-4 flex justify-between items-center transition-all duration-150 mt-5 mb-5"
                  >
                    <div>
                      <h3 className="customer-name font-bold text-lg text-gray-800">
                        {customer.name}
                      </h3>
                      <p className="text-sm font-medium ">
                        {customer.status === "unpaid" ||
                        customer.status === "partial"
                          ? `₱${customer.remainingBalance} - ${customer.status}`
                          : "Fully Paid"}
                      </p>
                    </div>
                    <div>
                      <Eye
                        size={54}
                        className="bg-[#2563eb] text-white p-2 rounded-full hover:bg-sari-blue-dark transition-all"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllCustomersPage;
