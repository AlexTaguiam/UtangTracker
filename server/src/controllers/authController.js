import User from "../models/User.js";
import admin from "../config/firebase.js";
import { sendResponse } from "../utils/responseHandler.js";

export const syncUser = async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { displayName, photoURL } = req.body; // Optional data from frontend

    //Checks if the user exist in mongodb
    let user = await User.findOne({ uid });

    //if no then we will create a new user
    if (!user) {
      user = await User.create({
        uid: uid,
        email: email,
        displayName: displayName || "",
        photoURL: photoURL || "",
        role: "customer",
      });

      await admin.auth().setCustomUserClaims(uid, { role: "customer" });
    } else {
      //If yes then we will update the user
      let updated = false;

      //Checks if the displayname and photoURL have truthy value by using shorthand &&
      if (displayName && displayName !== user.displayName) {
        user.displayName = displayName;
        updated = true;
      }

      if (photoURL && photoURL !== user.photoURL) {
        user.photoURL = photoURL;
        updated = true;
      }

      if (updated) {
        await user.save();
        console.log("User updated successfully", uid);
      } else {
        console.log("User sycned successfully", uid);
      }
    }

    const userData = {
      uid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: user.role,
    };

    sendResponse(res, 200, "User sycned successfully", userData);
  } catch (error) {
    console.error("Sync User error:", error);
    sendResponse(res, 500, "Error syncing user:", error.message);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });

    if (!user) {
      return sendResponse(sendResponse(res, 404, "User not found"));
    }

    const userData = {
      uid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: user.role,
      createdAt: user.createdAt,
    };

    sendResponse(res, 200, "Get profile successfull", userData);
  } catch (error) {
    console.error("Get profile error:", error);
    sendResponse(res, 500, "Error getting user profile", error.message);
  }
};
