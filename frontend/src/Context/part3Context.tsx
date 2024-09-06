import React, { useState, createContext } from "react";

import {
  IFromThreeValues,
  IForm3ContextInterface,
  FormProviderProps,
} from "../types/types";

export const Form3Context = createContext<IForm3ContextInterface>({
  currentFormThreeValues: {
    extraValue: "",
    numberOfPages: "",
    paperId: "",
    paperTitle: "",
  },
  updateFormThreeValues: () => {},
});

export const Form3ValuesProvider: React.FC<FormProviderProps> = ({
  children,
}) => {
  const [currentFormThreeValues, setCurrentFormThreeValues] =
    useState<IFromThreeValues>({
      extraValue: "",
      numberOfPages: "",
      paperId: "",
      paperTitle: "",
    });
  const updateFormThreeValues = (value: IFromThreeValues) => {
    setCurrentFormThreeValues(value);
  };
  const contextValue: IForm3ContextInterface = {
    currentFormThreeValues,
    updateFormThreeValues,
  };

  return (
    <Form3Context.Provider value={contextValue}>
      {children}
    </Form3Context.Provider>
  );
};
