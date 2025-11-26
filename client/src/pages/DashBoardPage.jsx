import axios from "axios";
import {
  Users,
  HandCoins,
  CircleCheckBig,
  CirclePlus,
  FileSearchCorner,
} from "lucide-react";

import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const DashBoardPage = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchDashBoard = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/dashboard`);
        setData(response.data);
      } catch (error) {
        console.log("Error in fetching dashboard", error.message);
      }
    };
    fetchDashBoard();
  }, []);

  return (
    <div className="flex  flex-col h-screen justify-center items-center bg-gray-100 font-poppins">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 min-h-screen flex  flex-col">
        <header>
          <section className="text-center mb-8 pt-4">
            <h1 className="text-3xl font-bold text-[#831843]">Dashboard</h1>
            <p className="text-gray-600 text-md"> Welcome back</p>
          </section>
        </header>
        <main>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#fef3c7] text-[#78350f] p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <section>
                <Users size={50} />
              </section>
              <section className="text-sm font-semibold">
                Total Customer
              </section>
              <section className="text-3xl font-bold">
                {data ? <p>{data.totalCustomer}</p> : <p>Loading...</p>}
              </section>
            </div>
            <div className="bg-[#fee2e2] text-red-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <section>
                <HandCoins size={50} />
              </section>
              <section className="text-sm font-semibold">Total Unpaid</section>
              <section className="text-3xl font-bold">
                {data ? <p>₱{data.totalUnpaid}</p> : <p>Loading...</p>}
              </section>
            </div>
          </div>
          <div className="col-span-2 bg-[#dcfce7] text-green-800 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <section className="pr-5">
                <CircleCheckBig size={50} />
              </section>
              <div>
                <section className="text-sm font-semibold">Total Paid</section>
                <section className="text-3xl font-bold">
                  {" "}
                  {data ? <p>₱{data.totalPaid}</p> : <p>Loading...</p>}
                </section>
              </div>
            </div>
          </div>
          <section className="text-lg font-semibold text-gray-700 mb-4 mt-8">
            Quick actions:
          </section>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/addCustomer"
              className="bg-[#16a34a] text-white p-4 rounded-lg shadow-md hover:bg-[#15803d] transition-all duration-200 flex flex-col items-center justify-center h-32"
            >
              <section>
                <CirclePlus size={50} />
              </section>
              <section className="text-md font-bold text-center">
                Add Utang
              </section>
            </Link>
            <Link
              to="/allCustomers"
              className="bg-[#2563eb] text-white p-4 rounded-lg shadow-md hover:bg-[#1d4ed8] transition-all duration-200 flex flex-col items-center justify-center h-32"
            >
              <section>
                <Users size={50} />
              </section>
              <section className="text-md font-bold text-center">
                View Customer
              </section>
            </Link>
            <Link
              to="/allUtang"
              className="col-span-2 bg-pink-800 text-white p-4 rounded-lg shadow-md hover:bg-[#831843] transition-all duration-200 flex items-center justify-center h-24"
            >
              <section className="pr-5">
                <FileSearchCorner size={50} />
              </section>
              <section className="text-lg font-bold">View all utangs</section>
            </Link>
            <div></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashBoardPage;
