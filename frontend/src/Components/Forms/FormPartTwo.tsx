import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ProgressContext } from "../../Context/ProgressContext";
import { Form2Context } from "../../Context/part2Context";
import Modal from "../Modals/PaymentConformation";
import {
  UserIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  IdentificationIcon,
} from "@heroicons/react/24/solid";
import { CURRENCY, FUNCTIONAL_AREA, ROLES } from "../../Data/Constants";
import { FormThreeContext } from "../../Context/lastFormContext";
import { IFormTwoValues } from "../../types/types";
import { Form1Context } from "../../Context/part1Context";
import { BASE_URL, UPLOAD_IMAGE } from "../../services/apiConstants"


const FormPartTwo: React.FC = () => {
  const { updateCurrentForm2Values } = React.useContext(Form2Context);
  const { currentFormOneValues } = useContext(Form1Context);
  const iconClassName = "absolute  w-6 h-6 left-3 top-2 text-gray-500";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { progress, updateProgress, reduceProgress } = React.useContext(ProgressContext);
  const formTwo = localStorage.getItem("FormPartTwo");
  const formTwoValues = formTwo && JSON.parse(formTwo);
  const { handleClick } = React.useContext(FormThreeContext);

  const [selectedFileUrl, setSelectedFileUrl] = useState<File | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<File | null>(null);


  const membershipIdProvider = () => {
    if (formTwoValues?.ieeeMembership === "non-IEEE member" || formTwoValues?.ieeeMembership === "IES member") {
      return "";
    } else {
      return formTwoValues?.membershipID;
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    register,
  } = useForm<IFormTwoValues>({
    defaultValues: {
      role: formTwoValues?.role || "",
      functionArea: formTwoValues?.functionArea || "",
      ieeeMembership: formTwoValues?.ieeeMembership || "IEEE member",
      membershipID: membershipIdProvider(),
      designation: formTwoValues?.designation || "",
    },
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const functionArea = watch("functionArea");
  const ieeeMembership = watch("ieeeMembership");
  const role = watch("role");

  useEffect(() => {
    if (ieeeMembership === "non-IEEE member" || ieeeMembership === "IES member") {
      setValue("membershipID", "");
    }
  }, [ieeeMembership, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileUrl(e.target.files[0]);
    }
  };

  const handleFileUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    const uploadZipUrl = BASE_URL + UPLOAD_IMAGE;
    if (!selectedFileUrl) {
      alert('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFileUrl);

    const response = await fetch(uploadZipUrl, {
      method: 'POST',
      body: formData, // Use FormData object for multipart/form-data
    });

    if (!response.ok) {
      console.error('File upload failed:', response.statusText);
    } else {
      console.log("Response-", response);
    }


    const result = await response.json();
    console.log("handleFileUpload", result);
    setSelectedFileUrl(result.url);
    setSelectedFileId(result.asset_id)
  };

  const onSubmit: SubmitHandler<IFormTwoValues> = (data) => {
    handleClick();
    handleOpenModal();
    const finalData = { ...data, selectedFileUrl, selectedFileId };
    updateCurrentForm2Values(finalData);
    localStorage.setItem("FormPartTwo", JSON.stringify(data));
    if (role !== "Listener") {
      if (progress < 3) {
        updateProgress();
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Sample Modal"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mb-4">
          <label htmlFor="role" className="block font-bold mb-1">
            Role
          </label>
          <Controller
            name="role"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <div className="w-full relative">
                <select
                  {...field}
                  id="role"
                  className="w-full p-2 pl-12 border rounded"
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value={ROLES.PAPER_AUTHOR}>Paper Author</option>
                  <option value={ROLES.LISTENER}>Listener</option>
                </select>
                <UserIcon className={iconClassName} />
              </div>
            )}
          />
          {errors.role && (
            <p className="text-red-500">{errors.role.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="functionArea" className="block font-bold mb-1">
            Functional Area
          </label>
          <Controller
            name="functionArea"
            control={control}
            rules={{ required: "Functional Area is required" }}
            render={({ field }) => (
              <div className="relative w-100">
                <select
                  {...field}
                  id="functionArea"
                  className="w-full p-2 pl-12 border rounded"
                >
                  <option value="" disabled>
                    Select your Function Area
                  </option>
                  <option value={FUNCTIONAL_AREA.FACULTY}>Faculty</option>
                  <option value={FUNCTIONAL_AREA.STUDENT}>Student</option>
                  <option value={FUNCTIONAL_AREA.INDUSTRYEXPERT}>
                    Industry Expert
                  </option>
                </select>
                <UserGroupIcon className={iconClassName} />
              </div>
            )}
          />
          {errors.functionArea && (
            <p className="text-red-500">{errors.functionArea.message}</p>
          )}
        </div>

        {functionArea === FUNCTIONAL_AREA.INDUSTRYEXPERT && (
          <div className="mb-4">
            <label htmlFor="designation" className="block font-bold mb-1">
              Designation
            </label>
            <div className="relative w-full ">
              <input
                id="designation"
                type="text"
                placeholder="Enter your name"
                {...register("designation", {
                  required: "Designation is required",
                })}
                className="border border-gray-300 h-10 pl-12 pr-4 rounded-md w-full"
              />
              <CheckBadgeIcon className={iconClassName} />
            </div>
            {errors.designation && (
              <span className="text-red-500">
                {errors.designation.message}
              </span>
            )}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="ieeeMembership" className="block font-bold mb-1">
            Membership Status
          </label>
          <Controller
            name="ieeeMembership"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="flex items-center">
                <div className="mr-4">
                  <input
                    {...field}
                    type="radio"
                    id="ieeeMember"
                    value="IEEE member"
                    {...register("ieeeMembership", {
                      required: "IEEE membership type is required",
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="ieeeMember">IEEE member</label>
                </div>
                <div className="mr-4">
                  <input
                    {...field}
                    type="radio"
                    id="nonIeeeMember"
                    value="non-IEEE member"
                    {...register("ieeeMembership", {
                      required: "IEEE membership type is required",
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="nonIeeeMember">Non-IEEE member</label>
                </div>
              </div>
            )}
          />
          {errors.ieeeMembership && (
            <p className="text-red-500">
              Please select IEEE membership status
            </p>
          )}
        </div>
        {ieeeMembership === "IEEE member" && (
          <div className="mb-4">
            <label htmlFor="membershipID" className="block font-bold mb-1">
              Membership ID
            </label>
            <Controller
              name="membershipID"
              control={control}
              defaultValue=""
              rules={{ required: "Membership ID is required" }}
              render={({ field }) => (
                <div className="w-full relative">
                  <input
                    {...field}
                    type="text"
                    id="membershipID"
                    placeholder="Enter your IEEE Membership ID"
                    className="border border-gray-300 h-10 pl-12 pr-4 rounded-md w-full"
                  />
                  <IdentificationIcon className={iconClassName} />
                </div>
              )}
            />
            {errors.membershipID && (
              <span className="text-red-500">
                {errors.membershipID.message}
              </span>
            )}
          </div>

        )}
        {/* Image Uploader for Students */}
        {functionArea === FUNCTIONAL_AREA.STUDENT && (
          <div className="mb-4">
            <label htmlFor="fileUpload" className="block font-bold mb-1">
              Upload Your Student ID
            </label>
            <div className="flex items-center space-x-3">

            <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer"
            />
            <button
              onClick={handleFileUpload}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm"
            >
              Upload
            </button>
            </div>

          </div>
        )}

        <p >Please bring a copy of your membership ID proof on the conference day.</p>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="w-1/4 lg:w-1/6 p-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              reduceProgress();
            }}
          >
            Back
          </button>
          {progress === 3 || role === "Listener" ? (
            <button
              type="submit"
              className="w-1/2 lg:w-2/6 p-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Proceed to Payment
            </button>
          ) : (
            <button
              type="submit"
              className="w-1/4 lg:w-1/6 p-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormPartTwo;
