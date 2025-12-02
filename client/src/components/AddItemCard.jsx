import React, { useEffect, useState } from "react";
import { formatCurrency } from "../utils/format";

const AddItemCard = ({ id, deleteCard, onChange }) => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const totalValue = quantity * price;

  useEffect(() => {
    onChange(id, { productName, quantity, price, total: totalValue });
  }, [productName, quantity, price]);

  return (
    <div className="product-row bg-white p-3 rounded-lg shadow-sm border border-gray-200 relative animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div className="w-full mr-2">
          <label className="block text-xs text-gray-500 mb-1">
            Product Name
          </label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            type="text"
            placeholder="e.g. Gin"
            className="product-name-input w-full border-b border-gray-300 focus:border-[#16a34a] focus:outline-none text-gray-800 font-medium text-sm pb-1"
          />
        </div>
        <button
          type="button"
          onClick={deleteCard}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Qty</label>
          <input
            type="number"
            min="1"
            max="50"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="qty-input w-full bg-gray-50 rounded border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:border-[#16a34a]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Price (₱)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0"
            min="1"
            max={5000}
            onChange={(e) => setPrice(e.target.value)}
            className="price-input w-full bg-gray-50 rounded border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:border-[#16a34a]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Total</label>
          <div className="row-total text-right font-bold text-gray-700 text-sm py-1">
            {formatCurrency(totalValue)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemCard;
