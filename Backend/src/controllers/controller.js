import customer from "../models/customer.js";
import Customer from "../models/customer.js";
//Load the Dashboard
export const getDashboard = async (_, res) => {
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

//Load all the Customer
export const getAllCustomers = async (_, res) => {
  try {
    const allCustomers = await Customer.find();

    const formatted = allCustomers.map((customer) => {
      let totalPaid = 0;
      let totalUnpaid = 0;

      customer.history.forEach((utang) => {
        if (utang.status === "paid") {
          totalPaid += utang.total;
        } else {
          totalUnpaid += utang.total;
        }
      });
      return {
        name: customer.name,
        totalPaid,
        totalUnpaid,
      };
    });

    res.status(200).json({ formatted });
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};

//Load a specific customer based on ID
export const getCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    let customerTotalPaid = 0;
    let customerTotalUnpaid = 0;

    customer.history.forEach((utang) => {
      if (utang.status === "paid") {
        customerTotalPaid += utang.total;
      } else if (utang.status === "unpaid") {
        customerTotalUnpaid += utang.total;
      }
    });

    res.status(200).json({
      name: customer.name,
      customerTotalPaid,
      customerTotalUnpaid,
      history: customer.history,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};

//Add a new Customer
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

export const updateUtangStatus = async (req, res) => {
  try {
    const { customerId, utangId } = req.params;
    const { status } = req.body;

    if (!["paid", "unpaid"].includes(status)) {
      return res.status(404).json({ error: "Invalid status value" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const utang = customer.history.id(utangId);
    if (!utang) {
      return res.status(404).json({ message: "Utang record not found" });
    }

    utang.status = status;

    await customer.save();

    res.status(200).json({
      message: `utang status updated to ${status}`,
      updatedUtang: utang,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};

export const updateUtangDetails = async (req, res) => {
  try {
    const { customerId, utangId } = req.params;
    const { product, price, amount, date, status } = req.body;

    const total = price * amount;

    if (!["paid", "unpaid"].includes(status)) {
      return res.status(404).json({ error: "Invalid Status Value" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const utang = customer.history.id(utangId);
    if (!utang) {
      return res.status(404).json({ message: "Utang Record not found" });
    }

    utang.product = product;
    utang.price = price;
    utang.amount = amount;
    utang.total = total;
    utang.date = date;
    utang.status = status;

    await customer.save();

    res.status(200).json({
      message: `utang details updated`,
      updatedDetails: utang,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};

//Delete a Customer
export const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    console.log("Customer ID:", customerId);

    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: `Customer with ${customerId} is succesfully deleted`,
      deletedCustomer: deletedCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};

//Delete a utang based on a customer history
export const deleteUtang = async (req, res) => {
  try {
    const { customerId, utangId } = req.params;

    const result = await Customer.findByIdAndUpdate(
      customerId,
      { $pull: { history: { _id: utangId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "utang deleted successfully", customer: result });
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};
