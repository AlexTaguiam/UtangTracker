import Customer from "../models/customer.js";

export const getDashboard = async (req, res) => {
  try {
    const totalCustomer = await Customer.countDocuments();
    const customers = await Customer.find();

    let totalPaid = 0;
    let totalUnpaid = 0;

    customers.forEach((customer) => {
      customer.history.forEach((entry) => {
        if (entry.status === "paid") {
          totalPaid += entry.total;
        } else if (entry.status === "unpaid") {
          totalUnpaid += entry.total;
        }
      });
    });

    res.status(200).json({
      totalCustomer,
      totalPaid,
      totalUnpaid,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const allCustomers = await Customer.find();
    res.status(200).json(allCustomers);
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};

export const getCustomer = (req, res) => {
  res.status(200).send("Customer Viewed Successfully");
};

export const addCustomer = async (req, res) => {
  try {
    const { name, product, amount, price } = req.body;
    const total = amount * price;

    const newUtang = {
      product,
      amount,
      price,
      total,
      status: "unpaid",
      date: new Date(),
    };

    let customer = await Customer.findOne({ name });

    //Add the customer if it doesnt exist yet
    if (!customer) {
      customer = new Customer({
        name,
        history: [newUtang],
      });

      await customer.save();
      return res.status(201).json({
        message: "New customer created + utang added!",
        customer,
      });
    }

    customer.history.push(newUtang);
    await customer.save();

    res.status(200).json({
      message: "Utang added to existing customer!",
      customer,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};

export const editCustomer = (req, res) => {
  res.status(200).send("edit customer added succesfully");
};

export const deleteCustomer = (req, res) => {
  h;
  res.status(200).send("customer deleted succesfully");
};
