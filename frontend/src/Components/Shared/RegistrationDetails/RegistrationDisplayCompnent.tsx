import { ROLE, ROLES } from "../../../Data/Constants";
import { IData } from "../../../types/types";

const RegistrationDisplayCompnent: React.FC<IData> = ({ data }) => {
  return (
    <div
      className="registration-display-component p-6 rounded-lg pb-10 overflow-y-auto"
      style={{ maxHeight: "300px" }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Registration Details
      </h2>

      <div className="section mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          Basic Information
        </h3>
        <hr />
        {data.vals1 ? (
          <ul className="list-none font-extrabold pl-0 space-y-2 text-gray-700">
            <li className="font-bold text-gray-600">Name: {data.vals1.name}</li>
            <li className="font-bold text-gray-600">
              Contact: {data.vals1.contact}
            </li>
            <li className="font-bold text-gray-600">
              Email: {data.vals1.email}
            </li>
            <li className="font-bold text-gray-600">
              Affiliation: {data.vals1.affiliation}
            </li>
            <li className="font-bold text-gray-600">
              Currency: {data.vals1.currency}
            </li>
          </ul>
        ) : (
          <p className="text-gray-500">
            No data available for Form Basic Information
          </p>
        )}
      </div>

      <div className="section mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          Professional Information
        </h3>
        <hr />
        {data.vals2 ? (
          <ul className="list-none font-extrabold pl-0 space-y-2 text-gray-700">
            <li className="font-bold text-gray-600">Role: {data.vals2.role === ROLES.DOCTORAL_CONSORTIUM ? "Research Colloquium" : data.vals2.role === ROLES.PAPER_AUTHOR ? "Paper Author" : data.vals2.role === ROLES.ATTENDEE ? "Attendee" : ""}</li>
            <li className="font-bold text-gray-600">
              Function Area: {data.vals2.functionArea}
            </li>
            {/* <li className="font-bold text-gray-600">
              IEEE Membership: {data.vals2.ieeeMembership === "non-IEEE member" ? "Non-IEEE Member" : data.vals2.membershipID === "IEEE member" ? "IEEE member" : ""}
            </li> */}
            <li className="font-bold text-gray-600">
              IEEE Membership: {data.vals2.ieeeMembership === "non-IEEE member" ? "Non-IEEE Member" : data.vals2.ieeeMembership === "IEEE member" ? "IEEE member" : data.vals2.ieeeMembership === "IES member" ? "IES member" : "" }
            </li>
            {data.vals2.membershipID && (
              <li className="font-bold text-gray-600">
                Membership ID: {data.vals2.membershipID}
              </li>
            )}
            {data.vals2.designation && data.vals2.functionArea === "Industry Expert" && (
              <li className="font-bold text-gray-600">
                Designation: {data.vals2.designation}
              </li>
            )}
          </ul>
        ) : (
          <p className="text-gray-500">
            No data available for Form Professional Information
          </p>
        )}
      </div>

      <div className="section">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          Paper Details
        </h3>
        <hr />
        {data.vals3 ? (
          <ul className="list-none font-extrabold pl-0 space-y-2 text-gray-700">
            {data?.vals2?.role !== ROLE.DOCTORAL_CONSORTIUM && data.vals3.paperTitle && (
              <li className="font-bold text-gray-600">
                Paper Title: {data.vals3.paperTitle}
              </li>
            )}
            {data?.vals2?.role === ROLE.DOCTORAL_CONSORTIUM && data.vals3.researchTitle && (
              <li className="font-bold text-gray-600">
                Research Title: {data.vals3.researchTitle}
              </li>
            )}
            {data.vals3.paperId && (
              <li className="font-bold text-gray-600">
                Paper ID: {data.vals3.paperId}
              </li>
            )}
            
            {data.vals3.extraValue && (
              <li className="font-bold text-gray-600">
                Extra Pages: {data.vals3.extraValue}
              </li>
            )}
            {data.vals3.numberOfPages && (
              <li className="font-bold text-gray-600">
                Number of Pages: {data.vals3.numberOfPages === "LessEqual6" ? "Less than or equal to 6" : "More than 6"}
              </li>
            )}
            
          </ul>
        ) : (
          <p className="text-gray-500">No data available for Paper Details</p>
        )}
      </div>
    </div>
  );
};

export default RegistrationDisplayCompnent;
