import React, { useEffect, useState } from "react";
import RegistrationDisplayCompnent from "./RegistrationDisplayCompnent";
import { Form1Context } from "../../../Context/part1Context";
import { Form2Context } from "../../../Context/part2Context";
import { Form3Context } from "../../../Context/part3Context";

const RegistrationDetailsComponent: React.FC = () => {
  const { currentFormOneValues } = React.useContext(Form1Context);
  const { currentValues } = React.useContext(Form2Context);
  const { currentFormThreeValues } = React.useContext(Form3Context);

  const [data, setData] = useState({
    vals1: currentFormOneValues,
    vals2: currentValues,
    vals3: currentFormThreeValues,
  });

  useEffect(() => {
    setData({
      vals1: currentFormOneValues,
      vals2: currentValues,
      vals3: currentFormThreeValues,
    });
  }, [currentFormOneValues, currentValues, currentFormThreeValues]);

  return (
    <div className="m-5 border rounded-md h-full">
      <RegistrationDisplayCompnent data={data} />
    </div>
  );
};

export default RegistrationDetailsComponent;
