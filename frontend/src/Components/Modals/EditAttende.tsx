import React, { useEffect, useState } from 'react';
import { IGetRegistrationDetailsData } from '../../types/types';
import axios from 'axios';
import { FUNCTIONAL_AREA, ROLES } from "../../Data/Constants";
import { BASE_URL, UPDATE_REGISTER } from "../../services/apiConstants";

interface ModalProps {
  isOpen: boolean;
  data: IGetRegistrationDetailsData | undefined;
  onClose: () => void;
  title: string;
  isEdit: boolean;
}

const EditAttende: React.FC<ModalProps> = ({ isOpen, data, onClose, isEdit }) => {
  const [isEditModeOn, setIsEditModeOn] = useState<boolean>(false);
  const [formData, setFormData] = useState<IGetRegistrationDetailsData | undefined>();

  useEffect(() => {
    setFormData(data)
  }, [data]);

  useEffect(() => {
    if (isEdit) {
      setIsEditModeOn(true);
    }
  }, [isEdit])

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      if (!prevData) return undefined;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log(formData);
    if (!formData) return;
  
    const updateId = formData._id; // Ensure formData has a _id property
    const url = `${BASE_URL}${UPDATE_REGISTER}/${updateId}`;
  
    try {
      const response = await axios.patch(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        // Handle the success response (e.g., display a success message, redirect, etc.)
      } else {
        // Handle failure response
        // setError("Submission failed. Please check your input.");
      }
  
      onClose();
      setIsEditModeOn(false);
    } catch (error) {
      console.error("Error during submission:", error);
      // setError("An error occurred during submission. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 ">
      <div className="flex justify-center ">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-center  w-1/2 ">
          <div className="p-4 border-b flex  justify-between items-center">
            <h2 className="text-lg font-semibold">Edit Attendee</h2>
            <button
              onClick={() => {
                onClose();
                setIsEditModeOn(false);
              }}
              className="bg-red-500 ml-5 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              X
            </button>
          </div>
          <div className="pl-5 relative inline-block">
            {isEditModeOn ? (
              <div className="p-1 flex items-center">
                <div className='w-96' style={{ width: "90vw", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className='flex items-center'>
                    <label htmlFor="name">Name:</label>
                    <input
                      id="name"
                      name='name'
                      type="text"
                      placeholder="Enter your name"
                      autoComplete="off"
                      className="border border-gray-300 h-10 pl-4 pr-4 rounded-md ml-2"
                      value={formData?.name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex items-center'>
                    <label htmlFor="email">Email:</label>
                    <input
                      id="mailId"
                      name='mailId'
                      type="text"
                      placeholder="Enter your email"
                      autoComplete="off"
                      className="border border-gray-300 h-10 pl-4 pr-4 rounded-md ml-2"
                      value={formData?.mailId || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex items-center'>
                    <label htmlFor="phone">Phone:</label>
                    <input
                      id="phone"
                      name='phone'
                      type="number"
                      placeholder="Enter your phone"
                      autoComplete="off"
                      className="border border-gray-300 h-10 pl-4 pr-4 rounded-md ml-2"
                      value={formData?.phone || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex items-center'>
                    <label htmlFor="affiliation">Affiliation:</label>
                    <input
                      id="affiliation"
                      name='affiliation'
                      type="text"
                      placeholder="Enter your affiliation"
                      autoComplete="off"
                      className="border border-gray-300 h-10 pl-4 pr-4 rounded-md ml-2"
                      value={formData?.affiliation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex items-center'>
                    <label htmlFor="registerType">Role:</label>
                    <select
                      id="registerType"
                      name='registerType'
                      className="p-2 pl-12 border rounded ml-2"
                      value={formData?.registerType || ""}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      {Object.values(ROLES).map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex items-center'>
                    <label htmlFor="occupation">Functional Area:</label>
                    <select
                      id="occupation"
                      name='occupation'
                      className="p-2 pl-12 border rounded ml-2"
                      value={formData?.occupation || ""}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select your Functional Area
                      </option>
                      {Object.values(FUNCTIONAL_AREA).map((occupation) => (
                        <option key={occupation} value={occupation}>
                          {occupation}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Membership Status */}
                  <div className="flex items-center">
                    <label htmlFor="membershipStatus" className="mr-4">Membership Status:</label>

                    <div className="mr-4">
                      <input
                        type="radio"
                        id="ieeeMember"
                        name="member"
                        value="IEEE member"
                        className="mr-2"
                        checked={formData?.member === "IEEE member"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="ieeeMember">IEEE member</label>
                    </div>

                    <div className="mr-4">
                      <input
                        type="radio"
                        id="nonIeeeMember"
                        name="member"
                        value="non-IEEE member"
                        className="mr-2"
                        checked={formData?.member === "non-IEEE member"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="nonIeeeMember">Non-IEEE member</label>
                    </div>

                    <div className="mr-4">
                      <input
                        type="radio"
                        id="iesMember"
                        name="member"
                        value="IES member"
                        className="mr-2"
                        checked={formData?.member === "IES member"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="iesMember">IES member</label>
                    </div>
                  </div>



                  <div className='flex items-center'>
                    <label htmlFor="membershipId">Membership ID:</label>
                    <input
                      id="membershipId"
                      name="membershipId"
                      type="text"
                      placeholder="Enter your membership ID"
                      autoComplete="off"
                      className="border border-gray-300 h-10 pl-4 pr-4 rounded-md ml-2"
                      value={formData?.membershipId || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex items-center'>
                    <label htmlFor="paperTitle">Paper Title:</label>
                    <input
                      id="paperTitle"
                      name="paperTitle"
                      type="text"
                      placeholder="Enter your paper title"
                      autoComplete="off"
                      className="border border-gray-300 h-10 pl-4 pr-4 rounded-md ml-2"
                      value={formData?.paperTitle || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex items-center'>
                    <label htmlFor="paperId">Paper ID:</label>
                    <input
                      id="paperId"
                      name="paperId"
                      type="text"
                      placeholder="Enter your paper ID"
                      autoComplete="off"
                      className="border border-gray-300 h-10 pl-4 pr-4 rounded-md ml-2"
                      value={formData?.paperId || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="p-4 border-t flex justify-end">
                    <button
                      onClick={() => {
                        setIsEditModeOn(false);
                      }}
                      className="bg-red-500 ml-5 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(event) => {
                        handleSubmit(event);
                      }}
                      className="bg-blue-500 ml-5 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Save Details
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <React.Fragment>
                <div className="p-1 flex items-center">
                  <div className='w-96' style={{ width: "90vw", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <p><span className='text-gray-800'>Name:</span> {data?.name}</p>
                    <p><span className='text-gray-800'>Mail ID:</span> {data?.mailId}</p>
                    <p><span className='text-gray-800'>Phone:</span> {data?.phone}</p>
                    <p><span className='text-gray-800'>Registeration Date:</span> {data?.createdAt}</p>
                    <p><span className='text-gray-800'>Register Type:</span> {data?.registerType}</p>
                    <p><span className='text-gray-800'>Member:</span> {data?.member}</p>
                    <p><span className='text-gray-800'>Occupation:</span> {data?.occupation}</p>
                    <p><span className='text-gray-800'>Price:</span> {data?.price}</p>
                    <p><span className='text-gray-800'>Pages:</span> {data?.pages}</p>
                    <p><span className='text-gray-800'>Affiliation:</span> {data?.affiliation}</p>
                    <p><span className='text-gray-800'>MembershipId:</span> {data?.membershipId}</p>
                    <p><span className='text-gray-800'>Paper Title:</span> {data?.paperTitle}</p>
                    <p><span className='text-gray-800'>Paper Id:</span> {data?.paperId}</p>
                    <button
                      onClick={() => {
                        setIsEditModeOn(true);
                      }}
                      className="bg-blue-500 ml-5 text-white px-4 py-2 rounded w-16 hover:bg-blue-700 self-end mr-4 mb-4"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAttende;

