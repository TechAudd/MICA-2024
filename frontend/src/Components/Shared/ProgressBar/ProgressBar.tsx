// ProgressBar.tsx

import React, { useContext } from "react";
import { ProgressContext } from "../../../Context/ProgressContext";

const ProgressBar: React.FC = () => {
  const { progress } = useContext(ProgressContext);

  // Calculate width of the progress bar
  const progressWidth = `${progress * 33.33333333333}%`;

  return (
    <div className="w-full bg-gray-200 rounded-lg">
      <div
        className="h-4 bg-green-500 rounded-lg"
        style={{ width: progressWidth }}
      ></div>
    </div>
  );
};

export default ProgressBar;
