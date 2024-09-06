import React from "react";
import { Loader } from "../ui/Loader";

interface ResultModalProps {
  textContent: string;
  onClose: () => void;
  isLoading:boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({ textContent, onClose, isLoading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all duration-300 ease-out"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div>
          <h2 id="modalTitle" className="text-xl font-semibold mb-4">
            Result
          </h2>
          <div className="flex flex-col justify-center items-center" >
          {isLoading && <Loader />}
          <p id="modalDescription" className="text-gray-700">
            {textContent}
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
