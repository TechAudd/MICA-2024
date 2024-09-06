// import React, { useEffect, useState } from "react";
import NavigationBar from "../Navigators/NavigationBar";
import ProgressBar from "../../ProgressBar/ProgressBar";
import BillComponent from "../../BillComponent/BillComponent";
import RegistrationDetailsComponent from "../../RegistrationDetails/RegistrationDetailsComponent";
import { useEffect, useState } from "react";
import { ReloadModal } from '../../../Modals/ReloadModal'


type RegisterLayoutComponentProps = {
  children: React.ReactNode;
};

const RegisterLayoutComponent: React.FC<RegisterLayoutComponentProps> = ({
  children,
}) => {

  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem("FormPartOne");
      localStorage.removeItem("FormPartTwo");
      localStorage.removeItem("FormPartThree");
      setShowModal(true)
    }, 1800000);
    return () => clearTimeout(timer);
  }, []);

  const onClose = () => {
    window.location.reload()
    setShowModal(false)
  }

  return (
    <div className="w-full h-screen flex flex-col bg-mainBackgroundColor ">
      {showModal && <ReloadModal onClose={onClose} />}
      <div className="h-50">
        <NavigationBar />
      </div>
      <div className="flex flex-row flex-grow lg:pb-10">
        <div className="w-full lg:w-2/3 h-full  border rounded-lg flex flex-col items-center p-5 lg:p-0">
          <div className=" h-18 w-full  lg:h-1/3 flex justify-center items-center md:hidden">
            <BillComponent />
          </div>
          <div className=" w-full  lg:w-2/3 pt-5 mb-10">
            <ProgressBar />
          </div>
          <div className=" w-full lg:w-2/3">{children}</div>
        </div>
        <div className="flex flex-col w-1/3 hidden md:block">
          <div className="h-1/3 flex justify-center items-center">
            <BillComponent />
          </div>
          <div className="h-2/3  ">
            {/* <RegistrationFees /> */}
            <RegistrationDetailsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLayoutComponent;
