import React, { useEffect, useState } from "react";
import { Combobox, ComboboxInput, ComboboxOptions } from "@headlessui/react";
import axios from "axios";

const AddUtangPage = () => {
  const [customers, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const getCustomersName = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/customers`);
        const names = response.data.formatted?.map((c) => c.name) || [];
        setCustomer(names);
      } catch (error) {
        console.error("Error in fething customers name", error);
      }
    };
    getCustomersName();
  }, []);

  const filteredCustomers =
    query === ""
      ? customers
      : customers.filter((customer) =>
          customer.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        );

  return (
    <div className="bg-gray-100 font-poppins">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 min-h-screen pb-24">
        <div className="text-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-sari-maroon">Add Utang</h1>
          <p className="text-gray-600 text-md">Record new items (Unpaid)</p>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Customer or Add a new One
            </label>
            <div className="relative rounded-md shadow-sm">
              <Combobox value={selectedCustomer} onChange={setSelectedCustomer}>
                <ComboboxInput
                  className={"w-full border rounded-lg px-3 py-2"}
                  displayValue={(customer) => customer}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Select or add customer"
                />
                <ComboboxOptions className="mt-1 border rounded-lg bg-white shadow-lg">
                  {filteredCustomers.length === 0 && query !== "" ? (
                    <Combobox.Option
                      value={query}
                      className="px-3 py-2 cursor-pointer"
                    >
                      New Customer: "{query}"
                    </Combobox.Option>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <Combobox.Option
                        key={customer}
                        value={customer}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {customer}
                      </Combobox.Option>
                    ))
                  )}
                </ComboboxOptions>
              </Combobox>
            </div>
          </div>
        </div>
        <div className="pt-3">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xl font-medium text-gray-700">
              Items List
            </label>
            <button
              type="button"
              onClick={""}
              className="text-xl font-bold text-[#16a34a] hover:text-green-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Item
            </button>
          </div>
        </div>
        <div className="space-y-3"></div>
      </div>
    </div>
  );
};

export default AddUtangPage;
