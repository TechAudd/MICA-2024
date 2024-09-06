import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

interface ReloadModalProps {
    onClose: () => void;
}

export const ReloadModal: React.FC<ReloadModalProps> = ({ onClose }) => {
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

                <div className="flex flex-col justify-center items-center gap-5">
                    <div className="flex flex-row ">
                        <ExclamationCircleIcon className="h-8 w-8 mr-2 text-red-600 font-bold" />
                        <p className="text-2xl">Please fill the form again</p>
                    </div>
                    <button className="border border-blue-700 px-3 py-1 rounded-lg bg-blue-500 text-white font-semibold" onClick={onClose} >Close</button>
                </div>
            </div>
        </div>
    );
};

