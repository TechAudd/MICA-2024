import React, { useState, createContext } from "react";

import {
  IFormOneValues,
  IForm1ContextInterface,
  FormProviderProps,
} from "../types/types";

export const Form1Context = createContext<IForm1ContextInterface>({
  currentFormOneValues: {
    name: "",
    contact: "",
    email: "",
    affiliation: "",
    currency: "",
  },
  updateFormOneValues: () => {},
});

export const Form1ValuesProvider: React.FC<FormProviderProps> = ({
  children,
}) => {
  const [currentFormOneValues, setCurrentFormOneValues] =
    useState<IFormOneValues>({
      name: "",
      contact: "",
      email: "",
      affiliation: "",
      currency: "",
    });
  const updateFormOneValues = (value: IFormOneValues) => {
    setCurrentFormOneValues(value);
  };

  const contextValue: IForm1ContextInterface = {
    currentFormOneValues,
    updateFormOneValues,
  };

  return (
    <Form1Context.Provider value={contextValue}>
      {children}
    </Form1Context.Provider>
  );
};
