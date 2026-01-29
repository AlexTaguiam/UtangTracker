import customer from "../models/customer.js";
import Customer from "../models/customer.js";
import mongoose from "mongoose";
import { sendResponse } from "../utils/responseHandler.js";
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

    const statsData = {
      totalCustomer,
      totalPaid: stats.totalPaid,
      totalUnpaid: stats.totalUnpaid,
    };

    // res.status(200).json({
    //   totalCustomer,
    //   totalPaid: stats.totalPaid,
    //   totalUnpaid: stats.totalUnpaid,
    // });

    return sendResponse(
      res,
      200,
      "Customer data retrieved successfully",
      statsData,
    );
  } catch (error) {
    // console.error("Dashboard error:", error);
    // res.status(500).json({ message: "Server Error" });

    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};

//Load all the Customer
export const getAllCustomers = async (_, res) => {
  try {
    const formattedCustomers = await Customer.aggregate([
      {
        $unwind: {
          path: "$history",
          preserveNullAndEmptyArrays: true,
        },
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
          lastDate: { $max: "$history.date" },
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
          lastDate: 1,
        },
      },
      {
        $sort: { lastDate: -1 },
      },
    ]);

    // res.status(200).json({ formatted: formattedCustomers });

    return sendResponse(
      res,
      200,
      "All Customer data retrieved successfully",
      formattedCustomers,
    );
  } catch (error) {
    // res.status(500).json({ error: "Server error" + error.message });
    return sendResponse(res, 500, `Server Error: ${error.message}`);
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
        $unwind: {
          path: "$history",
          preserveNullAndEmptyArrays: true,
        },
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
          history: {
            $sortArray: {
              input: "$history",
              sortBy: { date: -1 },
            },
          },
        },
      },
    ];

    const customerData = await Customer.aggregate(pipeline);

    if (customerData.length === 0) {
      // return res.status(404).json({ error: "Customer not found" });
      sendResponse(res, 404, `Customer not found: ${error.message}`);
    }

    // res.status(200).json(customerData[0]);
    sendResponse(
      res,
      200,
      "Single Customer retrieved successfully",
      customerData[0],
    );
  } catch (error) {
    // res.status(500).json({ error: "Server error" + error.message });
    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};

//Add a new Customer
export const addCustomer = async (req, res) => {
  try {
    const { name, products } = req.body;
    const normalizedName = name.trim();

    if (!name || !Array.isArray(products) || products.length === 0) {
      return sendResponse(res, 400, `Name and products are required`);
    }

    for (const item of products) {
      if (!item.product || !item.quantity || !item.price) {
        return sendResponse(
          res,
          400,
          `Each product must include product name, quantity and price`,
        );
      }
    }

    const productsWithTotal = products.map((item) => ({
      ...item,
      total: item.price * item.quantity,
    }));

    const totalAmount = productsWithTotal.reduce(
      (sum, item) => sum + item.total,
      0,
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

    // let customer = await Customer.findOne({ name });
    let customer = await Customer.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    //Add the customer if it doesnt exist yet
    if (!customer) {
      customer = new Customer({
        name: normalizedName,
        history: [newUtang],
      });

      await customer.save();

      return sendResponse(
        res,
        201,
        "New customer created + utang added!",
        customer,
      );
    }

    customer.history.push(newUtang);
    await customer.save();

    return sendResponse(
      res,
      200,
      "Utang added to existing customer!",
      customer,
    );
  } catch (error) {
    return sendResponse(res, 500, `Server Error: ${error.message}`);
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
      },
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
      { $pull: { history: { _id: utangId } } },
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

export const getSpecificTransaction = async (req, res) => {
  try {
    const { customerId, historyId } = req.params;

    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(customerId) },
      },
      {
        $unwind: "$history",
      },
      {
        $match: { "history._id": new mongoose.Types.ObjectId(historyId) },
      },
      {
        $project: {
          _id: 0,
          customerId: "$_id",
          customerName: "$name",
          transactions: {
            id: "$history._id",
            date: "$history.date",
            status: "$history.status",
            paidAmount: "$history.paidAmount",
            remainingBalance: "$history.remainingBalance",
            products: "$history.products",
            totalAmount: {
              $add: ["$history.paidAmount", "$history.remainingBalance"],
            },
          },
        },
      },
    ];

    const result = await Customer.aggregate(pipeline);

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const singleTransaction = result[0];

    res.status(200).json(singleTransaction);
  } catch (error) {
    console.error("Payment page transaction error:", error);

    res.status(500).json({ error: "Server error: " + error.message });
  }
};

export const getAllCustomersUtang = async (req, res) => {
  try {
    const customers = await Customer.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          history: 1,
        },
      },
      {
        $addFields: {
          compiledHistory: {
            $map: {
              input: { $ifNull: ["$history", []] },
              as: "h",
              in: {
                date: "$$h.date",
                status: "$$h.status",
                totalAmount: "$$h.totalAmount",
                paidAmount: "$$h.paidAmount",
                remainingBalance: "$$h.remainingBalance",
                product: "$$h.products",
              },
            },
          },
        },
      },
      {
        $addFields: {
          compiledHistory: {
            $sortArray: { input: "$compiledHistory", sortBy: { date: -1 } },
          },
        },
      },
      {
        $sort: { "compiledHistory.0.date": -1 },
      },
    ]);

    res.status(200).json({ customers });
  } catch (error) {
    console.error("Get All Customers Utang error:", error);

    res.status(500).json({ error: "Server error: " + error.message });
  }
};
