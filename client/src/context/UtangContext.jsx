import { useReducer } from "react";
import { createContext } from "react";

export const UtangContext = createContext();

export const utangReducer = (state, action) => {
  switch (action.type) {
    case "GET_DASHBOARD":
      return {
        ...state,
        statsData: action.payload,
      };
    case "GETALL_CUSTOMERS":
      return {
        ...state,
        formattedCustomer: [...state.formattedCustomer, action.payload],
      };
    case "GETSINGLE_CUSTOMER":
      return {
        ...state,
        customerData: action.payload,
      };
    case "ADDNEW_UTANG":
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    default:
      return state;
  }
};

export const UtangContextProvider = ({ children }) => {
  const initialState = {
    statsData: {},
    formattedCustomer: [],
    customerData: {},
    customers: [],
  };

  const [state, dispatch] = useReducer(utangReducer, initialState);

  return (
    <UtangContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UtangContext.Provider>
  );
};
