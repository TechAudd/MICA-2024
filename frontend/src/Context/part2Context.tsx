import React, { useState, createContext } from "react";
import {
  IFormTwoValues,
  IForm2ContextInterface,
  FormProviderProps,
} from "../types/types";



export const Form2Context = createContext<IForm2ContextInterface>({
  currentValues: {
    role: "",
    functionArea: "",
    ieeeMembership: "",
    membershipID: "",
    designation: "",
  },
  updateCurrentForm2Values: () => {},
});

export const Form2ValuesProvider: React.FC<FormProviderProps> = ({
  children,
}) => {
  const [currentValues, setCurrentValues] = useState<IFormTwoValues>({
    role: "",
    functionArea: "",
    ieeeMembership: "",
    membershipID: "",
  });

  const updateCurrentForm2Values = (value: IFormTwoValues) => {
    setCurrentValues(value);
  };

  const contextValue: IForm2ContextInterface = {
    currentValues,
    updateCurrentForm2Values,
  };

  return (
    <Form2Context.Provider value={contextValue}>
      {children}
    </Form2Context.Provider>
  );
};
