import React, { useState } from "react";

interface ILastFormContext {
  isClicked: boolean;
  handleClick: () => void;
}

interface ILastFormProps {
  children: React.ReactNode;
}

export const FormThreeContext = React.createContext<ILastFormContext>({
  isClicked: false,
  handleClick: () => {},
});

export const LastFormContextProvider: React.FC<ILastFormProps> = ({
  children,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const handleClick = () => {
    setIsClicked((prev) => !prev);
  };
  const contextValue: ILastFormContext = {
    isClicked,
    handleClick,
  };
  return (
    <FormThreeContext.Provider value={contextValue}>
      {children}
    </FormThreeContext.Provider>
  );
};
