import React, { useContext, useEffect, useState } from "react";
import { BASE_URL, CALCULATE_AMOUNT } from "../../../services/apiConstants";
import { BillContext } from "../../../Context/BillContext";
import { ProgressContext } from "../../../Context/ProgressContext";
import { ROLES } from "../../../Data/Constants";
import { FormThreeContext } from "../../../Context/lastFormContext";
import { Form3Context } from "../../../Context/part3Context";
import { useGetConversionRateQuery } from "../../../Redux/services/conversionApiSlice";

type currencyType = "USD" | "INR";

interface InputData {
  role?: string;
  name?: string;
  contact?: string;
  email?: string;
  affiliation?: string;
  paperTitle?: string;
  paperId?: string;
  functionArea?: string;
  ieeeMembership?: string;
  membershipID?: string;
  currency?: currencyType;
  extraValue?: string;
  numberOfPages?: string;
  designation?: string;
}

interface BillDetails {
  baseAmount: number;
  gst: string;
  amountWithGst: number;
  platformFee: string;
  netAmount: number;
}

const BillComponent: React.FC = () => {
  const { data } = useGetConversionRateQuery()
  console.log(data && data?.conversionRate)
  const {
    updateBaseAmount,
    updateNetAmount,
    updatePlatformFee,
    updateAmountWithGst,
    updateGst,
  } = useContext(BillContext);
  const { progress } = useContext(ProgressContext);
  const [currency, setCurrency] = useState<currencyType>("INR");
  const part1Values = localStorage.getItem("FormPartOne");
  const vals = part1Values && JSON.parse(part1Values);
  const partTwoValues = localStorage.getItem("FormPartTwo");
  const vals2 = partTwoValues && JSON.parse(partTwoValues);
  const { isClicked } = React.useContext(FormThreeContext);
  const [response, setResponse] = useState<BillDetails | null>();
  const { currentFormThreeValues } = useContext(Form3Context);
  const vals3 = currentFormThreeValues;

  useEffect(() => {
    if (progress === 2 && vals?.currency) {
      setCurrency(vals.currency);
    }
  }, [progress, vals?.currency]);

  // useEffect(() => {
  //   const part3Values = localStorage.getItem("FormPartThree");
  //   setVals3(part3Values && JSON.parse(part3Values));
  // }, [part3Values]);

  useEffect(() => {
    if (response?.netAmount && response.baseAmount) {
      updateNetAmount(response?.netAmount);
      updateBaseAmount(response.baseAmount);
      updateAmountWithGst(response.amountWithGst);
      updateGst(response.gst);
      updatePlatformFee(response.platformFee);
    }
  }, [
    response,
    updateBaseAmount,
    updateNetAmount,
    updateAmountWithGst,
    updateGst,
    updatePlatformFee,
  ]);

  useEffect(() => {
    const processData = (data: InputData) => {
      const returnObj = {
        registerType:
          data?.role === ROLES.DOCTORAL_CONSORTIUM
            ? "Doctoral Consortium"
            : data?.role === ROLES.PAPER_AUTHOR
              ? "Paper Author"
              : "Attendee",
        name: data?.name || "",
        phone: data?.contact || "",
        mailId: data?.email || "",
        affiliation: data?.affiliation,
        paperTitle: data?.paperTitle,
        paperId: data?.paperId || "",
        occupation:
          data?.functionArea === "Industry Expert"
            ? "Industry Expert"
            : data?.functionArea === "Student"
              ? "Student"
              : data?.functionArea === "Faculty" ? "Faculty" : data.functionArea === "Student Additional Registration" ? "Student Additional Registration" : "Student(Fully Registered)",
        designation: data?.designation,
        member: data?.ieeeMembership || "",
        membershipId: data?.membershipID || "",
        numberOfPages: data?.numberOfPages,
        extraPages: data.extraValue,
        currency: data?.currency,
      };

      return returnObj;
    };

    const data = { ...vals, ...vals2, ...vals3 };
    const reqBody = data && processData(data);
    const url = BASE_URL + CALCULATE_AMOUNT;
    const body = JSON.stringify(reqBody);
    const method = "POST";

    const calculateAmount = async () => {
      try {
        const response = await fetch(url, {
          method,
          body,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        setResponse(res.calculatedAmountData);
      } catch (error) {
        console.error("Error calculating amount:", error);
      }
    };

    if (reqBody) {
      calculateAmount();
    }
  }, [isClicked, vals3, updateBaseAmount, updateNetAmount]);

  return (
    <div className="w-full h-full border-2 md:m-5 flex justify-center items-center rounded-lg pl-2 pr-2 lg:pl-0 lg:pr-0 ">
      {response ? (
        <div className="flex flex-col  text-lg text-gray-800 w-full lg:w-2/3">
          <h2 className="text-black font-bold">Bill Summary</h2>

          <div className="flex justify-between">
            <p className="text-gray-400 font-semibold">Amount:</p>
            <p className="font-bold text-gray-500 ">
              {currency === "USD" ? "$ " : "₹ "}
              {response.amountWithGst}{currency === "USD" && data && data.conversionRate && <span className="ml-2 font-bold text-sm ">({(response?.amountWithGst * parseFloat(data?.conversionRate)).toFixed(2)} ₹)</span>}
            </p>
          </div>
          {vals2?.role !== ROLES.DOCTORAL_CONSORTIUM &&
            (vals3?.extraValue === "2" || vals3?.extraValue === "1") && (
              <p className="font-bold text-gray-400 text-sm mb-2">
                + Extra page(s)
              </p>
            )}
          {/* {currency === "INR" && (
            <p className="text-sm mt-2 font-semibold ">
              Please note that apart from the particulars, an extra 3.5%
              platform fee + GST will apply.
            </p>
          )} */}
          {/* {currency === "USD" && (
            <div className="hidden md:block md:flex md:justify-between  ">
              <p className="text-gray-400 font-semibold">Platform Fee:</p>
              <p className="font-bold text-gray-500 ">{response.platformFee}</p>
            </div>
          )}

          {currency === "USD" && (
            <div className="md:flex md:justify-between hidden md:block">
              <p className="text-gray-400 font-semibold">Total Amount:</p>
              <p className="font-bold text-black ">
                {currency === "USD" ? "$ " : "₹ "}
                {response.netAmount}
              </p>
            </div>
          )} */}
        </div>
      ) : (
        <div className="flex flex-col">
          <h2 className="text-black font-bold">Bill Summary</h2>
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
};

const MemoizedBillComponent = React.memo(BillComponent)



export default MemoizedBillComponent;
