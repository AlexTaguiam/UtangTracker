import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { UtangContextProvider } from "./context/UtangContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UtangContextProvider>
          <App />
          <Toaster />
        </UtangContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
