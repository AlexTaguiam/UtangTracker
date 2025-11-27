import customer from "../models/customer.js";
import Customer from "../models/customer.js";
import mongoose from "mongoose";
//Load the Dashboard
export const getDashboard = async (_, res) => {
  try {
    const totalCustomer = await Customer.countDocuments();

    const statsResult = await Customer.aggregate([
      { $unwind: "$history" },
      {
        $group: {
          _id: null,
          totalPaid: {
            $sum: {
              $cond: [
                { $in: ["$history.status", ["paid", "partial"]] },
                "$history.paidAmount",
                0,
              ],
            },
          },
          totalUnpaid: {
            $sum: {
              $cond: [
                { $ne: ["$history.status", "paid"] },
                "$history.remainingBalance",
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = statsResult[0] || { totalPaid: 0, totalUnpaid: 0 };

    res.status(200).json({
      totalCustomer,
      totalPaid: stats.totalPaid,
      totalUnpaid: stats.totalUnpaid,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//Load all the Customer
export const getAllCustomers = async (_, res) => {
  try {
    const formattedCustomers = await Customer.aggregate([
      {
        $unwind: "$history",
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },

          totalPaid: {
            $sum: {
              $cond: [
                { $in: ["$history.status", ["paid", "partial"]] },
                "$history.paidAmount",
                0,
              ],
            },
          },

          totalUnpaid: {
            $sum: {
              $cond: [
                { $ne: ["$history.status", "paid"] },
                "$history.remainingBalance",
                0,
              ],
            },
          },

          status: { $last: "$history.status" },

          remainingBalance: {
            $sum: "$history.remainingBalance",
          },
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          totalPaid: 1,
          totalUnpaid: 1,
          status: 1,
          remainingBalance: 1,
        },
      },
    ]);

    res.status(200).json({ formatted: formattedCustomers });
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};

export const getSingleCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(customerId) },
      },

      {
        $unwind: "$history",
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          history: { $push: "$history" },

          customerTotalPaid: {
            $sum: {
              $cond: [
                { $in: ["$history.status", ["paid", "partial"]] },
                "$history.paidAmount",
                0,
              ],
            },
          },

          customerTotalUnpaid: {
            $sum: {
              $cond: [
                { $ne: ["$history.status", "paid"] },
                "$history.remainingBalance",
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          name: 1,
          customerTotalPaid: 1,
          customerTotalUnpaid: 1,
          history: 1,
        },
      },
    ];

    const customerData = await Customer.aggregate(pipeline);

    if (customerData.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(customerData[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};

//Add a new Customer
export const addCustomer = async (req, res) => {
  try {
    const { name, products } = req.body;

    if (!name || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Name and products are required" });
    }

    for (const item of products) {
      if (!item.product || !item.quantity || !item.price) {
        return res.status(400).json({
          error: "Each product must include product name, quantity and price",
        });
      }
    }

    const productsWithTotal = products.map((item) => ({
      ...item,
      total: item.price * item.quantity,
    }));

    const totalAmount = productsWithTotal.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const paidAmount = 0;
    const remainingBalance = totalAmount;
    const status = "unpaid";

    const newUtang = {
      products: productsWithTotal,
      totalAmount,
      paidAmount,
      remainingBalance,
      status,
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
    res.status(500).json({ error: "Server error " + error.message });
  }
};

export const utangPayment = async (req, res) => {
  try {
    const { customerId, utangId } = req.params;
    const { paidAmount } = req.body;
    const paidAmountNum = parseFloat(paidAmount);

    if (isNaN(paidAmountNum) || paidAmountNum <= 0) {
      return res.status(400).json({ message: "Invalid paidAmount" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const utangRecord = customer.history.id(utangId);
    if (!utangRecord) {
      return res.status(404).json({ message: "Utang record not found" });
    }

    if (paidAmountNum > utangRecord.remainingBalance) {
      return res.status(400).json({ message: "Payment exceeds balance" });
    }

    const newRemaining = utangRecord.remainingBalance - paidAmountNum;
    const newStatus = newRemaining > 0 ? "partial" : "paid";

    const updateResult = await Customer.updateOne(
      {
        _id: customerId,
        "history._id": utangId,
      },
      {
        $inc: {
          "history.$.paidAmount": paidAmountNum,
          "history.$.remainingBalance": -paidAmountNum,
        },
        $set: {
          "history.$.status": newStatus,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res
        .status(500)
        .json({ message: "Update failed or record changed." });
    }

    const updatedCustomer = await Customer.findById(customerId);
    const updatedUtang = updatedCustomer.history.id(utangId);

    res.status(200).json({
      result: updatedUtang,
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

    const result = await Customer.updateOne(
      { _id: customerId },
      { $pull: { history: { _id: utangId } } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Utang record not found" });
    }

    res.status(200).json({ message: "utang deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" + error.message });
  }
};
