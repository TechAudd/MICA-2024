import React, { useContext, useEffect, useState } from "react";
import {
  BASE_URL,
  INITIATE_PAYMENT,
  ADD_REGISTRATION,
  VERIFY_AMOUNT,
  VERIFY_AMOUNT_MESSAGE,
  VERIFY_AMOUNT_FAILURE_MESSAGE,
  CONVERSION_RATE
} from "../../services/apiConstants";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { BillContext } from "../../Context/BillContext";
import { IVerifyPaymentRequestObject } from "../../types/types";
import { CURRENCY, FUNCTIONING_AREA, ROLES } from "../../Data/Constants";
import RegistrationDetailsComponent from "../Shared/RegistrationDetails/RegistrationDetailsComponent";
import { Form2Context } from "../../Context/part2Context";
import { Form1Context } from "../../Context/part1Context";
import { Form3Context } from "../../Context/part3Context";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

interface RequestData {
  registerType: "Doctoral Consortium" | "Paper Author" | "Listener";
  name: string;
  phone: string;
  mailId: string;
  affiliation: string;
  paperTitle?: string;
  paperId: string;
  occupation: "Industry Expert" | "Student" | "Faculty" | "Student(Fully Registered)" | "Student Additional Registration";
  member: string;
  membershipId: string;
  pages: string;
  price: number;
  txnid?: string;
  currency?: string;
  designation?: string;
  researchTitle?: string;
  uploadedFileUrl?: String;
  uploadedFileId?: String;
}

interface ConversionRateResponse {
  conversionRate: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { baseAmount, netAmount, platformFee } = useContext(BillContext);
  console.log({ type: typeof netAmount })
  const { currentValues } = useContext(Form2Context);
  const { currentFormOneValues } = useContext(Form1Context);
  const { currentFormThreeValues } = useContext(Form3Context);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showBankDetails, setShowBankDetails] = useState<boolean>(false);
  const [paymentDone, setPaymentDone] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [bill, setBill] = useState<number>(1)
  const [paymentViaNetBanking, setPaymentViaNetbanking] = useState(false)
  const [confirmDetailsClicked, setConfirmDetailsClicked] =
    useState<boolean>(false);
  const formOne = localStorage.getItem("FormPartOne");
  const formOneValues = formOne && JSON.parse(formOne);

  const formTwo = localStorage.getItem("FormPartTwo");
  const formTwoValues = formTwo && JSON.parse(formTwo);

  const formThree = localStorage.getItem("FormPartThree");
  const formThreeValues = formThree && JSON.parse(formThree);
  const navigate = useNavigate();

  useEffect(() => {
    setShowBankDetails(false);
    setPaymentDone(false);
    setConsent(false);
  }, [isOpen]);

  useEffect(() => {
    const currency = currentFormOneValues.currency

    const getUpdatedBill = async () => {
      if (currency === "USD") {
        const response = await fetch(BASE_URL + CONVERSION_RATE);
        const res: ConversionRateResponse = await response.json();
        const bill = parseFloat(res.conversionRate);
        return setBill(bill)
      } else {
        return setBill(1)
      }
    };
    getUpdatedBill()
  }, [currentFormOneValues.currency])

  if (!isOpen) return null;

  const findPages = () => {
    if (currentValues.role === ROLES.LISTENER) {
      return "";
    } else {
      return currentFormThreeValues?.numberOfPages === "MoreThan10"
        ? currentFormThreeValues?.extraValue?.toString()
        : "8";
    }
  };
  const price = netAmount * bill
  const requestData: RequestData = {
    registerType:
      currentValues?.role === ROLES.DOCTORAL_CONSORTIUM
        ? "Doctoral Consortium"
        : currentValues?.role === ROLES.PAPER_AUTHOR
          ? "Paper Author"
          : "Listener",
    name: currentFormOneValues?.name || "",
    phone: currentFormOneValues?.contact || "",
    mailId: currentFormOneValues?.email || "",
    affiliation: currentFormOneValues?.affiliation,
    paperTitle: currentFormThreeValues?.paperTitle,
    paperId: currentFormThreeValues?.paperId || "",
    occupation:
      currentValues?.functionArea === FUNCTIONING_AREA.INDUSTRYEXPERT
        ? "Industry Expert"
        : currentValues?.functionArea === FUNCTIONING_AREA.STUDENT
          ? "Student"
          : currentValues?.functionArea === FUNCTIONING_AREA.STUDENT_FULL_REGISTRATION ? "Student(Fully Registered)" : FUNCTIONING_AREA.STUDENT_ADDITIONAL ? "Student Additional Registration" : "Faculty",
    designation: currentValues?.designation || "",
    member: currentValues?.ieeeMembership || "",
    membershipId: currentValues?.membershipID || "",
    pages: findPages() || "",
    price,
    researchTitle: currentFormThreeValues?.researchTitle,
    currency: currentFormOneValues.currency
  };

  const registerData: RequestData = {
    registerType:
      currentValues?.role === ROLES.DOCTORAL_CONSORTIUM
        ? "Doctoral Consortium"
        : currentValues?.role === ROLES.PAPER_AUTHOR
          ? "Paper Author"
          : "Listener",
    name: currentFormOneValues?.name || "",
    phone: currentFormOneValues?.contact || "",
    mailId: currentFormOneValues?.email || "",
    affiliation: currentFormOneValues?.affiliation,
    paperTitle: currentFormThreeValues?.paperTitle,
    paperId: currentFormThreeValues?.paperId || "",
    occupation:
      currentValues?.functionArea === FUNCTIONING_AREA.INDUSTRYEXPERT
        ? "Industry Expert"
        : currentValues?.functionArea === FUNCTIONING_AREA.STUDENT
          ? "Student"
          : currentValues?.functionArea === FUNCTIONING_AREA.STUDENT_FULL_REGISTRATION ? "Student(Fully Registered)" : FUNCTIONING_AREA.STUDENT_ADDITIONAL ? "Student Additional Registration" : "Faculty",
    designation: currentValues?.designation || "",
    member: currentValues?.ieeeMembership || "",
    membershipId: currentValues?.membershipID || "",
    pages: findPages() || "",
    price: netAmount,
    researchTitle: currentFormThreeValues?.researchTitle,
    currency: currentFormOneValues.currency ,
    uploadedFileUrl :  currentFormThreeValues?.uploadedFileUrl,
    uploadedFileId :  currentFormThreeValues?.uploadedFileId,
  };


  const paymentRequestBody = (requestData: RequestData) => {
    const ph = requestData.phone.split(" ")[1].split("-")?.join("");
    const obj = {
      txnid: Date.now().toString(),
      amount: ((price).toFixed(2)).toString(),
      name: requestData.name,
      email: requestData.mailId,
      phone: ph,
      productinfo: "pass",
      surl: "http://localhost:9000/response",
      furl: "http://localhost:9000/response",
      udf1: "",
      udf2: "",
      udf3: "",
      udf4: "",
      udf5: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      sub_merchant_id: "",
      unique_id: "",
      split_payments: "",
      customer_authentication_id: "",
      udf6: "",
      udf7: "",
      udf8: "",
      udf9: "",
      udf10: "",
    };
    return obj;
  };

  const verifyPaymentBody = () => {
    const obj: IVerifyPaymentRequestObject = {
      currency: formOneValues?.currency,
      registerType:
        formTwoValues?.role === ROLES.DOCTORAL_CONSORTIUM
          ? "Doctoral Consortium"
          : formTwoValues?.role === ROLES.PAPER_AUTHOR
            ? "Paper Author"
            : "Listener",
      occupation:
        formTwoValues?.functionArea === FUNCTIONING_AREA.INDUSTRYEXPERT
          ? "Industry Expert"
          : formTwoValues?.functionArea === FUNCTIONING_AREA.STUDENT
            ? "Student"
            : formTwoValues?.functionArea === FUNCTIONING_AREA.FACULTY ? "Faculty" : formTwoValues?.functionArea === FUNCTIONING_AREA.STUDENT_ADDITIONAL ? "Student Additional Registration" : "Student (Fully Registered)",
      designation: formTwoValues?.designation || "",
      member: formTwoValues?.ieeeMembership || "",
      numberOfPages: formThreeValues?.numberOfPages,
      extraPages: findPages() || "",
      amount: netAmount,
    };
    return obj;
  };

  console.log(verifyPaymentBody())

  const onClickPayment = async () => {
    if (paymentViaNetBanking) {
      setConfirmDetailsClicked(true)
      setShowBankDetails(true)
      return
    }

    setConfirmDetailsClicked(true);
    setIsModalOpen(false);

    const paymentUrl = BASE_URL + INITIATE_PAYMENT;
    const paymentMethod = "POST";
    const paymentBody = JSON.stringify(paymentRequestBody(requestData));

    const verifyPaymentBodyObject = JSON.stringify({ ...verifyPaymentBody(), finalModal: true });
    const verifyPaymentUrl: string = BASE_URL + VERIFY_AMOUNT;
    const verifyMethod: string = "POST";

    const verifyBody = verifyPaymentBody();

    const paymentObject = JSON.parse(paymentBody);
    requestData.txnid = paymentObject.txnid;
    requestData.currency = verifyBody.currency;
    registerData.txnid = paymentObject.txnid

    const addDetailsUrl = BASE_URL + ADD_REGISTRATION;
    const addDetailsMethod = "POST";
    const addDetailsBody = JSON.stringify(registerData);

    try {
      const verifyAmount = await fetch(verifyPaymentUrl, {
        method: verifyMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: verifyPaymentBodyObject,
      });
      const response = await verifyAmount.json();
      if (response.message === VERIFY_AMOUNT_MESSAGE) {
        try {
          const addDetails = await fetch(addDetailsUrl, {
            method: addDetailsMethod,
            headers: {
              "Content-Type": "application/json",
            },
            body: addDetailsBody,
          });
          await addDetails.json();

          const paymentRequest = await fetch(paymentUrl, {
            method: paymentMethod,
            headers: {
              "Content-Type": "application/json",
            },
            body: paymentBody,
          });

          if (!paymentRequest.ok) {
            throw new Error("Failed to initiate payment");
          }
          const paymentResponse = await paymentRequest.json();
          window.location.href = paymentResponse.url;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setErrorMessage(VERIFY_AMOUNT_FAILURE_MESSAGE);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClickTryAgain = () => {
    setErrorMessage("");
  };

  const usdPaymentFunction = async () => {
    setPaymentDone(true);
    setShowBankDetails(false)
    const addDetailsUrl = BASE_URL + ADD_REGISTRATION;
    const addDetailsMethod = "POST";
    const date = new Date();

    requestData.txnid = `NETBANKING${date.toISOString()}`;
    requestData.currency = CURRENCY.USD;
    const addDetailsBody = JSON.stringify(requestData);
    try {
      const addDetails = await fetch(addDetailsUrl, {
        method: addDetailsMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: addDetailsBody,
      });
      await addDetails.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const PaymentDoneModal = () => {
    return (
      <div className="flex justify-center ">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-center  w-1/2 ">
          <div className="p-4 border-b flex  justify-between items-center">
            <h2 className="text-lg font-semibold">Payment Confirmation</h2>
          </div>
          <div className="pl-5 relative inline-block">
            <div className="p-1 flex items-center">
              <div>
                Please send the transaction proof to ietcint@hotmail.com. Our
                team will mail you the registration confirmation. If you don't
                see it in your inbox, check your spam or junk folders as well.
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-5">
              <button
                onClick={() => {
                  setShowBankDetails(false);
                  setPaymentDone(false);
                  onClose();
                  localStorage.clear();
                  window.location.href = "https://ietcint.com/user/index";
                }}
                className="bg-blue-500 ml-5 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const onClickCloseBankdetailsComponent = () => {
    onClose()
    setShowBankDetails(false)
    setConfirmDetailsClicked(false)
    setPaymentViaNetbanking(false)
  }

  const BankDetailsComponent = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden  w-full lg:w-1/2">
        <div className="p-4 border-b flex  justify-between items-center">
          <h2 className="text-lg font-semibold">Bank Details</h2>
          <button
            onClick={onClickCloseBankdetailsComponent}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="pl-5 relative inline-block">
          <div className="p-1 flex items-center">
            <div>
              Amount :{" "}
              <span className="font-semibold ">
                {" "}
                {formOneValues?.currency === "USD" ? "$ " : "₹ "} {baseAmount}{" "}
                {/* including GST */}
              </span>
            </div>
            {/* <div
            className="relative flex items-center"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <InformationCircleIcon className="h-6 w-6 text-blue-500 ml-2 cursor-pointer  " />
            {showTooltip && (
              <div className="absolute bottom-full mb-2 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                Goods and Services Tax by Govt of India
              </div>
            )}
          </div> */}
          </div>
          {formTwoValues.role !== ROLES.DOCTORAL_CONSORTIUM &&
            (formThreeValues?.extraValue === "2" ||
              formThreeValues?.extraValue === "1") && (
              <p className="mb-2">+ Extra page(s)</p>
            )}
          <div className="p-1">
            Platform Fee :{" "}
            <span className="font-semibold "> {platformFee}</span>
          </div>

          <div className="p-1">
            Total :
            <span className="font-semibold ">
              {" "}
              {formOneValues?.currency === "USD" ? "$ " : "₹ "} {netAmount}
            </span>
          </div>
          <p>
            <strong className="text-red-700">Account Details</strong> (Click
            Confirm Payment only when transaction is successful)
          </p>
          <div className="p-4 w-fullflex flex-col items-center space-x-3 bg-gray-100 rounded-lg shadow-sm">
            <p className="text-gray-700 ml-3">
              <strong>Name of Account </strong>: Mahindra University
            </p>
            <p className="text-gray-700">
              <strong>Name of Bank</strong> : Yes Bank
            </p>
            <p className="text-gray-700">
              <strong>Bank Account Number</strong> : 009794600001165
            </p>
            <p className="text-gray-700">
              <strong>Branch</strong> : Kompally Branch, Yes Bank Ltd, Ground Floor,
              155,1-56,1-57-44, Old Bounderies, Survey no-1, Pet Bashirabad, HT
              Road, Kompally, Hyderabad 500014
            </p>
            <p className="text-gray-700">
              <strong>Type of Account</strong> : Savings
            </p>
            <p className="text-gray-700">
              <strong>IFSC Code</strong> : YESB0000097
            </p>
            <p className="text-gray-700">
              <strong>Swift Code</strong> : YESBINBB
            </p>
            <p className="text-gray-700">
              <strong className="text-red-700">Note: </strong>Please send the
              transaction proof to ietcint@hotmail.com
            </p>
          </div>

          <div className="p-1">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span className="text-blue-500 font-semibold">
                View Entered Details
              </span>
              {showDetails ? (
                <ChevronUpIcon className="h-5 w-5 text-blue-500 ml-2" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-blue-500 ml-2" />
              )}
            </div>
            {showDetails && (
              <div className="mt-2 p-2 border rounded bg-gray-100">
                <RegistrationDetailsComponent />
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-5">
          <button
            onClick={onClickCloseBankdetailsComponent}
            className="bg-blue-500 ml-5 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Review Form
          </button>
          {!isModalOpen && errorMessage === "" && (
            <button
              disabled={!consent}
              onClick={usdPaymentFunction}
              className={`relative flex items-center justify-center mr-5 text-white px-4 py-2 rounded ${consent ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500"
                } transition duration-300 ease-in-out`}
            >
              Confirm Payment
            </button>
          )}
          {errorMessage !== "" && (
            <button
              onClick={onClickTryAgain}
              className="bg-blue-500 mr-5 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    )
  }

  return baseAmount > 0 ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 ">
      {paymentDone && (
        <PaymentDoneModal />
      )}
      {confirmDetailsClicked && showBankDetails && paymentViaNetBanking && (
        <BankDetailsComponent />
      )}
      {!confirmDetailsClicked && !showBankDetails && <div className="bg-white rounded-lg shadow-lg overflow-hidden  w-full lg:w-1/2">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {!isModalOpen ? "Payment Confirmation" : "Registration Status"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        {!isModalOpen && errorMessage === "" && (
          <div className="pl-5 relative inline-block">
            <div className="p-1 flex items-center">
              <div>
                Amount :{" "}
                <span className="font-semibold ">
                  {" "}
                  {formOneValues?.currency === "USD" ? "$ " : "₹ "}{" "}
                  {baseAmount}
                  {/* including GST */}
                </span>
              </div>
            </div>
            {formTwoValues?.role !== ROLES.DOCTORAL_CONSORTIUM &&
              (formThreeValues?.extraValue === "2" ||
                formThreeValues?.extraValue === "1") && (
                <p className="mb-2">+ Extra page(s)</p>
              )}
            <div className="p-1">
              Total :
              <span className="font-semibold ">
                {" "}
                {formOneValues?.currency === "USD" ? "$ " : "₹ "} {netAmount}
              </span>
            </div>
            <div className="p-4 w-3/4 flex flex-col items-center space-x-3 bg-gray-100 rounded-lg shadow-sm">
              <p className="text-gray-700">
                Please note that apart from the particulars, an extra 3.5%
                platform fee will apply.
                <span className="text-red-600 font-semibold">
                  {" "}
                  (Mandatory)
                </span>
              </p>
              <div className="w-full mt-2 flex items-center gap-2">
                <input
                  checked={consent}
                  onClick={() => setConsent((prev) => !prev)}
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  id="consentbutton"
                />
                <label htmlFor="consentbutton">I Understand</label>
              </div>
            </div>
            <div>
              {currentFormOneValues.currency === "USD" && <div className="w-full mt-2 flex items-center gap-2">
                <input
                  checked={paymentViaNetBanking}
                  onClick={() => setPaymentViaNetbanking((prev) => !prev)}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  id="netbankingbutton"
                />
                <label htmlFor="netbankingbutton">Make payment via bank transfer</label>
              </div>}
            </div>
            <div className="p-1">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
              >
                <span className="text-blue-500 font-semibold">
                  View Entered Details
                </span>
                {showDetails ? (
                  <ChevronUpIcon className="h-5 w-5 text-blue-500 ml-2" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-blue-500 ml-2" />
                )}
              </div>
              {showDetails && (
                <div className="mt-2 p-2 border rounded bg-gray-100">
                  <RegistrationDetailsComponent />
                </div>
              )}
            </div>
          </div>
        )}
        {errorMessage !== "" && (
          <div className="flex justify-center items-center m-5  ">
            <p>Error in payment process, Try again!</p>{" "}
          </div>
        )}
        {isModalOpen && (
          <div className="text-center">Registration Successfull.</div>
        )}
        <div className="p-4 border-t flex justify-end gap-5">
          <button
            onClick={onClose}
            className="bg-blue-500 ml-5 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Close
          </button>
          {!isModalOpen && errorMessage === "" && (
            <button
              disabled={!consent}
              onClick={onClickPayment}
              className={`relative flex items-center justify-center mr-5 text-white px-4 py-2 rounded ${consent ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500"
                } transition duration-300 ease-in-out`}
            >
              {confirmDetailsClicked ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Confirm Details"
              )}
            </button>
          )}
          {errorMessage !== "" && (
            <button
              onClick={onClickTryAgain}
              className="bg-blue-500 mr-5 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again!
            </button>
          )}
        </div>
      </div>}
    </div>
  ) : (
    <div>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Payment Status</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <div>
          <h2>Error Fetching Price! Please fill the form again. </h2>
          <button
            onClick={() => navigate("/form")}
            className="bg-blue-500 mr-5 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
