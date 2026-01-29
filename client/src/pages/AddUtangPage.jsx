import React, { useEffect, useState } from "react";
import { Combobox, ComboboxInput, ComboboxOptions } from "@headlessui/react";
import axios from "axios";
import AddItemCard from "../components/AddItemCard";
import { formatCurrency } from "../utils/format";
import { toast } from "react-hot-toast";
import NavigationBar from "../components/NavigationBar";
import Goback from "../components/Goback";
import api from "../services/api";

const AddUtangPage = () => {
  const [customers, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [query, setQuery] = useState("");
  const [card, setCard] = useState([]);
  const [cardData, setCardData] = useState([]);

  const addCard = () => {
    const newId = Date.now();
    setCard([...card, newId]);
    setCardData([
      ...cardData,
      { id: newId, productName: "", quantity: 0, price: 0, total: 0 },
    ]);
  };

  const deleteCard = (deleteId) => {
    setCard(card.filter((id) => deleteId !== id));
    setCardData(cardData.filter((card) => card.id !== deleteId));
  };

  const handleCardData = (id, newCardData) => {
    setCardData((prevCardData) =>
      prevCardData.map((card) =>
        card.id === id ? { ...card, ...newCardData } : card,
      ),
    );
  };

  const totalAmount = cardData.reduce((acc, curr) => acc + curr.total, 0);

  const products = cardData.map((customer) => {
    return {
      product: customer.productName,
      quantity: customer.quantity,
      price: customer.price,
    };
  });
  console.log(selectedCustomer);
  console.log(totalAmount);
  console.log(products);

  useEffect(() => {
    const getCustomersName = async () => {
      try {
        const response = await api.get("/customers");
        console.log(response);
        const names = response.map((c) => c.name);
        console.log(names);
        setCustomer(names);
      } catch (error) {
        console.error("Error in fetching customers name", error);
      }
    };
    getCustomersName();
  }, []);

  const handleSubmit = async () => {
    try {
      if (
        selectedCustomer.trim() === "" ||
        !products ||
        Object.keys(products).length === 0
      ) {
        return console.log("Invalid inputs — please review and resubmit");
      }

      const response = await api.post("/customers", {
        name: selectedCustomer,
        products: products,
      });
      console.log(
        `Products is successfully added to ${selectedCustomer}`,
        response.data,
      );
      toast.success("“We have got it! Your submission has been saved.”");
      setCardData([]);
      setCard([]);
      setSelectedCustomer("");
    } catch (error) {
      console.error("Error in Adding the products", error);
      toast.error("“Oops! Something went wrong. Please try again.”");
    }
  };

  const filteredCustomers =
    query === ""
      ? customers
      : customers.filter((customer) =>
          customer.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        );

  return (
    <div className="bg-gray-100 font-poppins pb-20">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 min-h-screen pb-24">
        <Goback />
        <div className="text-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-[#831843]">Add Utang</h1>
          <p className="text-gray-600 text-md">Record new items (Unpaid)</p>
        </div>
        <form className="space-y-5">
          <div>
            <label
              htmlFor="inputCustomer"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Customer or Add a new One
            </label>
            <div className="relative rounded-md shadow-sm">
              <Combobox value={selectedCustomer} onChange={setSelectedCustomer}>
                <ComboboxInput
                  id="inputCustomer"
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
        </form>
        <div className="pt-3">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xl font-medium text-gray-700">
              Items List
            </label>
            <button
              type="button"
              onClick={addCard}
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
        <div className="space-y-3">
          {card.map((id) => (
            <AddItemCard
              key={id}
              id={id}
              deleteCard={() => deleteCard(id)}
              onChange={handleCardData}
            />
          ))}
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-xl shadow-lg mt-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Total Amount</span>
            <span
              className="text-2xl font-bold text-white"
              id="displayGrandTotal"
            >
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 italic text-right">
            *Added to unpaid balance
          </p>
        </div>
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-bold bg-[#16a34a] hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sari-green-dark transition-all duration-200"
            style={{
              paddingTop: "14px",
              paddingBottom: "14px",
              fontSize: "1.1rem",
            }}
          >
            Save Utang
          </button>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
};

export default AddUtangPage;
