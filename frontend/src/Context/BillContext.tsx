import React, { useState } from "react";

// Define the context interface
export interface ITotalBillContext {
  baseAmount: number;
  netAmount: number;
  amountWithGst: number;
  platformFee: string;
  gst: string;

  updateBaseAmount: (value: number) => void;
  updateNetAmount: (value: number) => void;
  updateAmountWithGst: (value: number) => void;
  updatePlatformFee: (value: string) => void;
  updateGst: (value: string) => void;
}

// Define props interface for the provider
interface ITotalBillProviderProps {
  children: React.ReactNode;
}

// Create the context with initial values
export const BillContext = React.createContext<ITotalBillContext>({
  baseAmount: 0,
  netAmount: 0,
  amountWithGst: 0,
  gst: "",
  platformFee: "",

  updateBaseAmount: () => {},
  updateAmountWithGst: () => {},
  updatePlatformFee: () => {},
  updateNetAmount: () => {},
  updateGst: () => {},
});

// Export the provider component
export const BillProvider: React.FC<ITotalBillProviderProps> = ({
  children,
}) => {
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [amountWithGst, setAmountWithGst] = useState<number>(0);
  const [gst, setGst] = useState<string>("");
  const [platformFee, setPlatformFee] = useState<string>("");

  const updateBaseAmount = (value: number) => {
    setBaseAmount(value);
  };

  const updateNetAmount = (value: number) => {
    setNetAmount(value);
  };

  const updatePlatformFee = (value: string) => {
    setPlatformFee(value);
  };
  const updateAmountWithGst = (value: number) => {
    setAmountWithGst(value);
  };
  const updateGst = (value: string) => {
    setGst(value);
  };

  const contextValue: ITotalBillContext = {
    baseAmount,
    updateBaseAmount,
    netAmount,
    updateNetAmount,
    updatePlatformFee,
    updateAmountWithGst,
    updateGst,
    amountWithGst,
    gst,
    platformFee,
  };

  return (
    <BillContext.Provider value={contextValue}>{children}</BillContext.Provider>
  );
};
