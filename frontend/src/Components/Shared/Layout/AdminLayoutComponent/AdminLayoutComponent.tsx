import React, { useState } from "react";
import Sidebar from "../Navigators/Sidebar";
import AdminNavbar from "../Navigators/AdminNavbar";

interface IAdminLayoutComponentProps {
  children: React.ReactNode;
}

const AdminLayoutComponent: React.FC<IAdminLayoutComponentProps> = ({
  children,
}) => {
  const [currentTab, setCurrentTab] = useState<string>("Overview");
  
  // Function to check if child is a valid React element
  const isReactElement = (
    child: React.ReactNode
  ): child is React.ReactElement<{ setCurrentTab: (tab: string) => void }> => {
    return React.isValidElement(child);
  };

  // Function to render children with setCurrentTab prop
  const renderChildrenWithProps = () => {
    return React.Children.map(children, (child) => {
      if (isReactElement(child)) {
        return React.cloneElement(child, { setCurrentTab });
      }
      return child;
    });
  };

  return (
    <div className="flex flex-row h-screen ">
      {/* sidebar */}
      <div className="p-2 w-1/6 pt-20">
        <Sidebar currentTab={currentTab} />
      </div>
      {/* navbar and admin content */}
      <div className="flex flex-col w-full h-screen">
        {/* Navigation bar */}
        <div className="h-20">
          <AdminNavbar />
        </div>
        {/* content section */}
        <div className="flex-grow">{renderChildrenWithProps()}</div>
      </div>
    </div>
  );
};

export default AdminLayoutComponent;
