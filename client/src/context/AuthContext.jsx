import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserRole = async (user) => {
    if (user) {
      try {
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role || "customer";
        setUserRole(role);
        return role;
      } catch (error) {
        console.log("Error Fetching role", error);
        setUserRole("customer");
        return "customer";
      }
    }
    setUserRole(null);
    return null;
  };

  const signup = async (email, password) => {
    try {
      setError(null);
      //Create a new user with firebase
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("Firebase User Created", result.user.uid);

      //sycn the user to mongodb
      await api.post("/auth/sync");
      console.log("User Sycned to  MongoDB");

      //fetch the role of the user
      await fetchUserRole(result.user);

      return result;
    } catch (error) {
      console.error("sigin error", error);
      setError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);

      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfull", result.user.uid);

      //sycn the user to mongodb
      await api.post("/auth/sync");
      console.log("User Sycned to  MongoDB");

      //fetch the role of the user
      await fetchUserRole(result.user);

      return result;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    }
  };

  const signinWithGoogle = async () => {
    try {
      setError(null);

      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign in Successfull", result.user.uid);

      await api.post("/auth/sync", {
        displayName: result.user.displayName,
        photoUrl: result.user.photoURL,
      });
      console.log("User Sycned to  MongoDB");

      //fetch the role of the user
      await fetchUserRole(result.user);

      return result;
    } catch (error) {
      console.error("Google signin error:", error);
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUserRole(null);
      console.log("User Logged out");
    } catch (error) {
      console.log("Logout error");
      setError(error.message);
      throw error;
    }
  };

  const getIdToken = async () => {
    if (currentUser) {
      return await currentUser.getIdToken;
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);

        if (user) {
          console.log("Auth state changed - user logged in", user.uid);
          await fetchUserRole(user);
        } else {
          console.log("Auth state changed - user logged out");
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user", error.message);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const values = {
    currentUser,
    userRole,
    loading,
    error,
    fetchUserRole,
    signup,
    login,
    signinWithGoogle,
    logout,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={{ ...values }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
