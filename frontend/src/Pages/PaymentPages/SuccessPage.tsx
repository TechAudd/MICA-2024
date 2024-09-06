import React, { useEffect, useState, useRef } from "react";
import { BASE_URL, UPDATE_WITH_TXNID } from "../../services/apiConstants";
import { useNavigate, useParams } from "react-router-dom";
import ResultModal from "../../Components/Modals/ResultModal";
import { PaymentResultModal } from "../../Components/Modals/PaymentResultModal";


const SuccessPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [wrongId, setWrongId] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { tnxid } = params;
  const apiCalled = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateRegistration = async (txnid: string | undefined) => {
      const url = `${BASE_URL}${UPDATE_WITH_TXNID}/${txnid}`;
      const method = "PUT";
      const body = JSON.stringify({ payment: true });

      try {
        const req = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });
        if (req) {
          setLoading(false);
        }
        if (req.status === 200 && req.ok) {
          setIsModalOpen(true);
          setWrongId(false);
        } else {
          setWrongId(true);
        }
      } catch (error) {
        console.error("Failed to update registration:", error);
      }
    };
    if (!apiCalled.current) {
      apiCalled.current = true;
      updateRegistration(tnxid);
    }
  }, [tnxid]);

  return (
    <div>
      {isModalOpen && loading &&  (
        <ResultModal
        isLoading={loading}
          textContent={
            loading
              ? "Processing payment do not close"
              : wrongId
              ? "Wrong Transaction Id"
              : "Payment Successfull"
          }
          onClose={() => navigate("/form")}
        />
      )}
      {isModalOpen && !loading && (
        <PaymentResultModal />
      )}
    </div>
  );
};

export default SuccessPage;
