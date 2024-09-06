import React, { useEffect, useState } from "react";
import AttendeesTable from "../../Components/Tables/AttendeesPageTable/AttendeesTable";
import { useGetRegistrationsQuery } from "../../Redux/services/attendeesApiSlice";
import { CustomLoader } from "../../Components/ui/Loader";

interface AttendeesPageProps {
  setCurrentTab: (tab: string) => void;
}

const AttendeesPage: React.FC<AttendeesPageProps> = ({ setCurrentTab }) => {
  const [pageNumber , setPageNumber] = useState<number>(1)
  const {
    data: registrationDetails,
    isFetching : loadingRegistrationDetails,
    isError: errorLoadingRegistrationDetails,
    isSuccess: fetchingDataSuccess,
  } = useGetRegistrationsQuery({page:pageNumber});



  useEffect(() => {
    setCurrentTab("Attendees");
  }, [setCurrentTab]);

  const handlePageChange = (requestedPage:number):void => {
    setPageNumber(requestedPage)
  }

  return (
    <div className="mt-24">
      {loadingRegistrationDetails && <CustomLoader w={8} h={8} />}
      {errorLoadingRegistrationDetails && <p>Error Fetching Data</p>}
      {fetchingDataSuccess && registrationDetails?.data && (
        <AttendeesTable currentPage={pageNumber} handlePageChange={handlePageChange} totalPages={registrationDetails?.totalPages} originalData={registrationDetails?.data} />
      )}
    </div>
  );
};

export default AttendeesPage;
