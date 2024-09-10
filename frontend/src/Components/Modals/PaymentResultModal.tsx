import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export const PaymentResultModal: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      title="Payment Successful"
      extra={[
        <Button
          onClick={() => {
            window.location.href = "https://www.mahindrauniversity.edu.in/advanced-communications-and-machine-intelligence-mica/";
            localStorage.clear();
          }}
          type="primary"
          key="console"
        >
          Back
        </Button>,
        <Button
          onClick={() => {
            navigate("/form");
            localStorage.clear();
          }}
          key="buy"
        >
          Buy Again
        </Button>,
      ]}
      subTitle="Please check your email for the invoice details and invitation. It may take 1-5 minutes to arrive. If you don't see it in your inbox, make sure to check your spam or junk folders as well."
    />
  );
};
