import React, { useEffect } from "react";
import { ChildProps } from "../../types/types";
import { useGetRegisterCountQuery, useGetRegisterRevenueQuery } from "../../Redux/services/overviewApiSlice";
import { useGetConversionRateQuery } from "../../Redux/services/conversionApiSlice";
import { DisplayCard } from "../../Components/ui/DisplayCard";
import {
  UsersIcon,CurrencyRupeeIcon ,ArrowTrendingUpIcon} from "@heroicons/react/24/solid";
import Graph from "../../Components/StatComponents/RegistrationGraphs";
const OverviewPage: React.FC<ChildProps> = ({setCurrentTab}:ChildProps) => {
   const {data:registerDataCount } = useGetRegisterCountQuery()
   const {data:revenueData} = useGetRegisterRevenueQuery()
   const {data: conversionData} = useGetConversionRateQuery();
  useEffect(()=>{
   
    setCurrentTab("Overview")
  },[setCurrentTab])

  function roundToDecimalPlaces(number:number, decimalPlaces:number) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
}
useEffect(()=>{
  console.log("registerDataCount Data",registerDataCount );

  
  
},[registerDataCount,revenueData,conversionData])

// const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
// const values = [12, 19, 3, 5, 2, 3];
  return(
    <div className="flex flex-col h-full pl-5 mt-24">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-24 mb-10">
  {registerDataCount && (
    <DisplayCard
      heading="REGISTRATIONS"
      content={registerDataCount?.totalRegisters?.toString() + " attendees"}
      icon={UsersIcon}
    />
  )}
  {revenueData && (
    <DisplayCard
      heading="TICKET SALES"
      content={
        "₹ " +
        roundToDecimalPlaces(
          (revenueData?.totalPrice?.INR || 0) +
          (revenueData?.totalPrice?.USD || 0) * 83.5,
          2
        ).toString()
      }
      icon={CurrencyRupeeIcon}
    />
  )}
  {conversionData && (
    <DisplayCard
      heading="CONVERSION RATE"
      content={conversionData?.conversionRate?.toString()+"%"}
      icon={ArrowTrendingUpIcon}
    />
  )}
</div>


<div className="flex flex-col justify-center">
<div className="flex justify-center items-center border border-gray-100 shadow-md" style={{height:"400px", width:"auto"}}>{
     registerDataCount && <Graph data={registerDataCount} />}
    
     </div>
     <div className="flex justify-center items-center border border-gray-100 shadow-md mt-10" style={{height:"500px", width:"auto"}}>

     </div>
</div>


    </div>
  )
};

export default OverviewPage;
