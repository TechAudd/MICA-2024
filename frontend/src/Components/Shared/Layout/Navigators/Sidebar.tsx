import React, { useEffect, useState } from "react";
import { SidebarData } from "../../../../Data/SidebarData/SidebarData";
import { Link } from "react-router-dom";

interface SidebarProps {
  currentTab:string
}

const Sidebar: React.FC<SidebarProps> = ({currentTab}:SidebarProps) => {
  const [selectedTab, setSelectedTab] = useState<string>(currentTab);

  useEffect(()=>{
    setSelectedTab(currentTab)
  },[currentTab])

  return (
    <div className="mt-24">
      {SidebarData.map((item) => (
        <Link onClick={() => setSelectedTab(item.title)} to={item.navigator}>
          <div
            className={`w-full flex flex-row gap-8 pl-8 p-2 mb-5  ${
              selectedTab !== item.title ? " " : "border-b-4 "
            }    border-mainColor  `}
          >
            <item.icon
              style={{
                color: `${selectedTab === item.title ? "#5271ff" : "#686d76"}`,
              }}
              className={`h-6 w-6 `}
            />
            <p
              className={`${selectedTab === item.title ? "font-semibold" : ""}`}
              style={{
                color: `${selectedTab === item.title ? "#5271ff" : "#686d76"}`,
              }}
            >
              {item.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
