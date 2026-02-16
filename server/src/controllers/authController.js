import User from "../models/User.js";
import admin from "../config/firebase.js";
import { sendResponse } from "../utils/responseHandler.js";

export const syncUser = async (req, res) => {
  try {
    if (!req.user) {
      sendResponse(req, 401, "User not authenticated");
    }
    const { uid, email } = req.user;

    const { displayName } = req.body || "";
    const { photoURL } = req.body || "";

    //Checks if the user exist in mongodb
    let user = await User.findOne({ firebaseUid: uid });

    //if no then we will create a new user
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email,
        displayName: displayName || "",
        photoURL: photoURL || "",
        role: "customer",
      });

      await admin.auth().setCustomUserClaims(uid, { role: "customer" });
      console.log("SUCCESS - Sending response");
      const data = {
        uid: user.firebaseUid,
        email: user.email,
        role: user.role,
      };
      return sendResponse(req, 200, "User Synced Success", data);
    } else {
      //If yes then we will update the user
      let updated = false;

      // Checks if the displayname and photoURL have truthy value by using shorthand &&
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
        console.log("User synced successfully", uid);
      }
    }

    const userData = {
      uid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: user.role,
    };

    sendResponse(res, 200, "User synced successfully", userData);
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
      return sendResponse(res, 404, "User not found");
    }

    const userData = {
      uid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: user.role,
      createdAt: user.createdAt,
    };

    sendResponse(res, 200, "Get profile successful", userData);
  } catch (error) {
    console.error("Get profile error:", error);
    sendResponse(res, 500, "Error getting user profile", error.message);
  }
};
