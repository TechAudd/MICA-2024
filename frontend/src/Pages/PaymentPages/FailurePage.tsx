import React from "react";
import { Button, Result,  } from 'antd';
import { useNavigate } from "react-router-dom";

const FailurePage: React.FC = () => {
 const navigate = useNavigate()
  return (
    <Result
    status="error"
    title="Payment Failed"
    subTitle="Please check and modify the following information before resubmitting."
    extra={[
      <Button onClick={()=>navigate("/form")} type="primary" key="console">
        Back
      </Button>
    ]}
  >
  </Result>
  );
};

export default FailurePage;
