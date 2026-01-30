import { UtangContext } from "../context/UtangContext";
import { useContext } from "react";

export const useUtangContext = () => {
  const context = useContext(UtangContext);

  if (!context) {
    throw new Error("UseUtangContext Must be use inside UtangContextProvider");
  }

  return context;
};
