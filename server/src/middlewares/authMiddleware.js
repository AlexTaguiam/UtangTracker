import { sendResponse } from "../utils/responseHandler.js";
import admin from "../config/firebase.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(res, 401, "No token provided");
  }
  //extract token from the header
  const token = authHeader.split(" ")[1];
  console.log("Token from middleware", token);
  try {
    //Verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);

    //Attached the data to the header

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      role: decodedToken.role || "customer",
    };

    next();
  } catch (error) {
    console.error("auth middleware error", error);
    sendResponse(res, 401, "Invalid or expired token");
  }
};
