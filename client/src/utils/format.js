export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "₱0.00";

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num == null || isNaN(num)) return "0.00";
  return Number(num).toFixed(2);
};
