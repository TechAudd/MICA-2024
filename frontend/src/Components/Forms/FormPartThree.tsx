import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ProgressContext } from "../../Context/ProgressContext";
import Modal from "../Modals/PaymentConformation";
import { ROLES } from "../../Data/Constants";
import { Form3Context } from "../../Context/part3Context";
import { IFromThreeValues } from "../../types/types";
import { Form1Context } from "../../Context/part1Context";

const FormPartThree: React.FC = () => {
  const data = localStorage.getItem("FormPartTwo");
  const isDoc: boolean =
    data && JSON.parse(data)?.role === ROLES.DOCTORAL_CONSORTIUM ? true : false;
  const { progress, updateProgress, reduceProgress } =
    React.useContext(ProgressContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateFormThreeValues } = React.useContext(Form3Context);
  const { currentFormOneValues } = React.useContext(Form1Context)

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const formThree = localStorage.getItem("FormPartThree");
  const formThreeValues = formThree && JSON.parse(formThree);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IFromThreeValues>({
    defaultValues: {
      paperTitle: formThreeValues?.paperTitle || "",
      paperId: formThreeValues?.paperId || "",
      numberOfPages: formThreeValues?.numberOfPages || "",
      extraValue: formThreeValues?.extraValue || "",
      researchTitle: formThreeValues?.researchTitle || "",
    },
  });

  const numberOfPages = watch("numberOfPages");
  const paperId = watch("paperId");
  const paperTitle = watch("paperTitle");

  useEffect(() => {
    if (numberOfPages === "LessEqual6") {
      const updatedValues = {
        paperId,
        paperTitle,
        numberOfPages,
        extraValue: "0",
      };
      setValue("extraValue", "0");
      localStorage.setItem("FormPartThree", JSON.stringify(updatedValues));
    } else {
      const updatedValues = {
        paperId,
        paperTitle,
        numberOfPages,
        extraValue: "",
      };
      setValue("extraValue", "");
      localStorage.setItem("FormPartThree", JSON.stringify(updatedValues));
    }
  }, [numberOfPages, paperId, paperTitle, setValue]);


  const onSubmit: SubmitHandler<IFromThreeValues> = (data) => {
    updateFormThreeValues(data);
    localStorage.setItem("FormPartThree", JSON.stringify(data));
    handleOpenModal();
    if (progress < 3) {
      updateProgress(); // Update progress context if progress is less than 3
    }
  };

  const getValidationRules = () => {
    if (isDoc) {
      return { required: "Enter No. of Pages" };
    } else {
      return {
        required: "Please enter a value of 1 or 2",
        pattern: {
          value: /^[1-2]$/,
          message: "Please enter a value of 1 or 2",
        },
      };
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
        {isDoc && (
          <div className="mb-4">
            <label className="block font-bold mb-1" htmlFor="researchTitle">
              Research Title
            </label>
            <input
              className="border border-gray-300 h-10 pl-3 pr-4 rounded-md w-full"
              type="text"
              id="researchTitle"
              placeholder="Enter paper title"
              {...register("researchTitle", {
                required: "Research title is required",
              })}
            />
            {errors.researchTitle && (
              <span className="text-red-500">
                {errors.researchTitle.message}
              </span>
            )}
          </div>
        )}
        {!isDoc && (
          <>
            <div className="mb-4">
              <label className="block font-bold mb-1" htmlFor="paperTitle">
                Paper Title
              </label>
              <input
                className="border border-gray-300 h-10 pl-3 pr-4 rounded-md w-full"
                type="text"
                id="paperTitle"
                placeholder="Enter paper title"
                {...register("paperTitle", {
                  required: "Paper Title is required",
                })}
              />
              {errors.paperTitle && (
                <span className="text-red-500">
                  {errors.paperTitle.message}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-1" htmlFor="paperId">
                Paper Id
              </label>
              <input
                id="paperId"
                type="text"
                {...register("paperId", { required: "Paper ID is required" })}
                className="border border-gray-300 h-10 pl-3 pr-4 rounded-md w-full"
              />
              {errors.paperId && (
                <span className="text-red-500">{errors.paperId.message}</span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="numberOfPages" className="block font-bold mb-1">
                Number of Pages
              </label>
              <Controller
                name="numberOfPages"
                control={control}
                rules={{ required: "Number of pages is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="numberOfPages"
                    className="w-full p-2 border rounded"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select number of pages
                    </option>
                    <option value="LessEqual6">Equal to or less than 6</option>
                    <option value="MoreThan6">More than 6</option>
                  </select>
                )}
              />
              {errors.numberOfPages && (
                <span className="text-red-500">
                  {errors.numberOfPages.message}
                </span>
              )}
            </div>

            {numberOfPages === "MoreThan6" && (
              <div className="mb-4">
                <label htmlFor="extraValue" className="block font-bold mb-1">
                  Number of extra pages
                </label>
                <Controller
                  name="extraValue"
                  control={control}
                  defaultValue=""
                  rules={getValidationRules()}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      id="extraValue"
                      placeholder={
                        isDoc ? "Enter number of pages" : "Max no.of pages 2"
                      }
                      className="border border-gray-300 h-10 pl-3 pr-4 rounded-md w-full"
                    />
                  )}
                />
                <span>
                  Extra Page Registration (for every extra page of the paper with more than 6 pages)
                  ( {`${currentFormOneValues.currency === "USD" ? "35 USD" : "2938 INR"}`})
                </span>

                {errors.extraValue && (
                  <span className="text-red-500">
                    {errors.extraValue.message}
                  </span>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="w-1/6 p-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              reduceProgress();
            }}
          >
            Back
          </button>
          <button
            type="submit"
            className="1/2 lg:w-1/3 p-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {progress === 3 ? "Proceed to Payment" : "Next"}
          </button>
        </div>
      </form>
    </>
  );
};

export default FormPartThree;
