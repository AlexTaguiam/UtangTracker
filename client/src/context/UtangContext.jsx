import { useReducer } from "react";
import { Children } from "react";
import { createContext } from "react";

export const UtangContext = createContext();

export const utangReducer = (state, action) => {
  switch (action.type) {
    case "ADD_UTANG":
      return {
        utang: [...state.utang, action.payload],
      };
    default:
      return {
        state,
      };
  }
};

export const UtangContextProvider = ({ Children }) => {
  const initialState = {
    utang: null,
  };

  const [state, dispatch] = useReducer(utangReducer, initialState);

  return (
    <UtangContext.Provider value={{ state, dispatch }}>
      {Children}
    </UtangContext.Provider>
  );
};
