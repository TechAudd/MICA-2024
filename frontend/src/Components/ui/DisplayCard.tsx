import React from "react";

interface ICardProps {
    heading: string;
    content?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const DisplayCard: React.FC<ICardProps> = ({ heading, content, icon: Icon }) => {
    return (
        <div className="flex w-2/3  border border-gray-100 shadow-md w-full">
            <div className="w-1/3 flex justify-center items-center">
                <Icon className="w-12 h-12 text-mainColor bg-secondaryBackgroundColor rounded-3xl  p-2" />
            </div>
            <div className="flex-grow">
                <p className="font-medium text-gray-500 h-1/3">{heading}</p>
                <p className="font-bold h-2/3 flex items-center text-lg ">{content}</p>
            </div>
        </div>
    );
};
