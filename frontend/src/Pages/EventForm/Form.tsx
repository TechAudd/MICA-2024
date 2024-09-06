import React from "react";
import { ProgressContext } from "../../Context/ProgressContext";
import FormPartOne from "../../Components/Forms/FormPartOne";
import FormPartTwo from "../../Components/Forms/FormPartTwo";
import FormPartThree from "../../Components/Forms/FormPartThree";

const Form: React.FC = () => {
  const { progress } = React.useContext(ProgressContext);

  return (
    <>
      {progress === 1 && <FormPartOne />}
      {progress === 2 && <FormPartTwo />}
      {progress === 3 && <FormPartThree />}
    </>
  );
};

export default Form;
