import { sendResponse } from "../utils/responseHandler.js";
import admin from "../config/firebase.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authrization;
  try {
    if (!authHeader && !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 401, "No token provided");
    }
    //Extack token from the header
    const token = authHeader.split(" ")[1];

    //Verify the token
    const decodedToken = await admin.auth().verifyToken(token);

    //Attached the data to the header
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_Verified,
      role: decodedToken.role || "customer",
    };

    next();
  } catch (error) {
    console.error("");
    sendResponse(res, 401, "Invalid or expired token");
  }
};
