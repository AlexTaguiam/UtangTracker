import customer from "../models/customer.js";
import Customer from "../models/customer.js";
import mongoose from "mongoose";
import { sendResponse } from "../utils/responseHandler.js";
//Load the Dashboard
export const getDashboard = async (req, res) => {
  try {
    const { uid } = req.user;
    const totalCustomer = await Customer.countDocuments({ firebaseUid: uid });

    const statsResult = await Customer.aggregate([
      { $match: { firebaseUid: uid } },
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

    return sendResponse(
      res,
      200,
      "Customer data retrieved successfully",
      statsData,
    );
  } catch (error) {
    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};

//Load all the Customer
export const getAllCustomers = async (req, res) => {
  try {
    const { uid } = req.user;
    const formattedCustomers = await Customer.aggregate([
      { $match: { firebaseUid: uid } },
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

    return sendResponse(
      res,
      200,
      "All Customer data retrieved successfully",
      formattedCustomers,
    );
  } catch (error) {
    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};

export const getSingleCustomer = async (req, res) => {
  try {
    const { uid } = req.user;
    const customerId = req.params.customerId;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(customerId),
          firebaseUid: uid,
        },
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
      sendResponse(res, 404, `Customer not found: ${error.message}`);
    }

    sendResponse(
      res,
      200,
      "Single Customer retrieved successfully",
      customerData[0],
    );
  } catch (error) {
    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};

//Add a new Customer
export const addCustomer = async (req, res) => {
  try {
    const { uid } = req.user;
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
      firebaseUid: uid,
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    //Add the customer if it doesnt exist yet
    if (!customer) {
      customer = new Customer({
        firebaseUid: uid,
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
    const { uid } = req.user;
    const { customerId, utangId } = req.params;
    const { paidAmount } = req.body;
    const paidAmountNum = parseFloat(paidAmount);

    if (isNaN(paidAmountNum) || paidAmountNum <= 0) {
      return sendResponse(res, 400, "Please enter a valid payment amount");
    }

    const customer = await Customer.findOne({
      _id: customerId,
      firebaseUid: uid,
    });
    if (!customer) {
      return sendResponse(res, 404, "Customer not found");
    }

    const utangRecord = customer.history.id(utangId);
    if (!utangRecord) {
      return sendResponse(res, 404, "Utang record not found");
    }

    if (paidAmountNum > utangRecord.remainingBalance) {
      return sendResponse(
        res,
        400,
        `Payment exceeds balance. Remaining: ${utangRecord.remainingBalance}`,
      );
    }

    const newRemaining = utangRecord.remainingBalance - paidAmountNum;
    const newStatus = newRemaining > 0 ? "partial" : "paid";

    const updateResult = await Customer.updateOne(
      {
        _id: customerId,
        firebaseUid: uid,
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
      return sendResponse(res, 500, "Update failed or record changed");
    }

    const updatedCustomer = await Customer.findById(customerId);
    const updatedUtang = updatedCustomer.history.id(utangId);

    return sendResponse(res, 200, "Successfully paid utang", updatedUtang);
  } catch (error) {
    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};

//Delete a Customer
export const deleteCustomer = async (req, res) => {
  try {
    const { uid } = req.user;
    const customerId = req.params.customerId;
    console.log("Customer ID:", customerId);

    const deletedCustomer = await Customer.findOneAndDelete({
      _id: customerId,
      firebaseUid: uid,
    });

    if (!deletedCustomer) {
      return sendResponse(res, 404, "Customer not found");
    }

    return sendResponse(
      res,
      200,
      "Customer deleted successfully",
      deletedCustomer,
    );
  } catch (error) {
    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};

//Delete a utang based on a customer history
export const deleteUtang = async (req, res) => {
  try {
    const { uid } = req.user;
    const { customerId, utangId } = req.params;

    const result = await Customer.updateOne(
      { _id: customerId, firebaseUid: uid },
      { $pull: { history: { _id: utangId } } },
    );

    if (result.matchedCount === 0) {
      return sendResponse(res, 404, "Customer not found");
    }
    if (result.modifiedCount === 0) {
      return sendResponse(res, 404, "Record not found");
    }

    return sendResponse(res, 200, "Record Successfully Deleted ");
  } catch (error) {
    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};

export const getSpecificTransaction = async (req, res) => {
  try {
    const { uid } = req.user;
    const { customerId, historyId } = req.params;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(customerId),
          firebaseUid: uid,
        },
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
      return sendResponse(res, 404, "Transaction not found");
    }

    const singleTransaction = result[0];

    return sendResponse(
      res,
      200,
      "Transaction Retrieved Successfully",
      singleTransaction,
    );
  } catch (error) {
    console.error("Payment page transaction error:", error);
    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};

export const getAllCustomersUtang = async (req, res) => {
  try {
    const { uid } = req.user;
    const customers = await Customer.aggregate([
      { $match: { firebaseUid: uid } },
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
    return sendResponse(
      res,
      200,
      "Successfully retrieved all customer records",
      customers,
    );
  } catch (error) {
    console.error("Get All Customers Utang error:", error);
    return sendResponse(res, 500, `Server Error: ${error.message}`);
  }
};
