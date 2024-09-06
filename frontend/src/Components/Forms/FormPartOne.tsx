import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  UserIcon,
  EnvelopeIcon,
  BuildingLibraryIcon, PhoneIcon
} from "@heroicons/react/24/solid";
import { ProgressContext } from "../../Context/ProgressContext";
import "react-phone-input-2/lib/style.css";
import { FormThreeContext } from "../../Context/lastFormContext";
import { Form1Context } from "../../Context/part1Context";
import { IFormOneValues } from "../../types/types";

const FormPartOne: React.FC = () => {
  const formOne = localStorage.getItem("FormPartOne");
  const formOneValues = formOne && JSON.parse(formOne);
  const { handleClick } = React.useContext(FormThreeContext);
  const { progress, updateProgress, reduceProgress } =
    React.useContext(ProgressContext);
  const { updateFormOneValues } = React.useContext(Form1Context);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormOneValues>({
    defaultValues: {
      name: formOneValues?.name || "",
      contact: formOneValues?.contact || "",
      affiliation: formOneValues?.affiliation || "",
      currency: formOneValues?.currency || "INR",
      email: formOneValues?.email || "",
    },
  });
  const iconClassName = "absolute  w-6 h-6 left-3 top-2 text-gray-500  ";
  const onSubmit: SubmitHandler<IFormOneValues> = (data) => {
    handleClick();
    updateFormOneValues(data);
    localStorage.setItem("FormPartOne", JSON.stringify(data));
    if (progress < 3) {
      updateProgress();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-4">
        <label htmlFor="name" className="block font-bold mb-1">
          Name
        </label>
        <div className="relative w-full ">
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="off"
            {...register("name", { required: "Name is required" })}
            className="border border-gray-300 h-10 pl-12 pr-4 rounded-md w-full"
          />
          <UserIcon className="absolute  w-6 h-6 left-3 top-2 text-gray-500  " />
        </div>
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="contact" className="block font-bold mb-1">
          Contact
        </label>
        <Controller
          name="contact"
          control={control}
          rules={{
            required: "Contact number is required",
            pattern: {
              value: /^\+\d{1,3}\s\d{1,15}$/,
              message: "Invalid phone number format. Example: +91 1231231231 ",
            },
          }}
          render={({ field }) => (
            <div className="w-full relative">
              <input
                {...field}
                id="contact"
                type="text"
                autoComplete="off"
                placeholder="+91 1231231231"
                className="border border-gray-300 h-10 pl-12 pr-4 rounded-md w-full"
              />
              <PhoneIcon className="absolute  w-6 h-6 left-3 top-2 text-gray-500  " />
            </div>
          )}
        />
        {errors.contact && (
          <span className="text-red-500">{errors.contact.message}</span>
        )}
      </div>

      {/* <div className="mb-4 w-full">
        <label htmlFor="phone" className="block font-bold mb-1">
          Contact
        </label>
        <Controller
          name="contact"
          control={control}
          rules={{
            required: "Contact number is required",
            validate: (value) =>
              value.replace(/[^0-9]/g, "").length >= 10 ||
              "Invalid phone number format",
          }}
          render={({ field }) => (
            <PhoneInput
              {...field}
              country={"in"}
              inputProps={{
                id: "phone",
                name: "phone",
                required: true,
                autoFocus: true,
                autocomplete: "off",
              }}
              onChange={(value, country, e, formattedValue) =>
                handlePhoneInputChange(value, country, e, formattedValue)
              }
              containerClass="w-full"
              inputStyle={{ width: "100%" }}
              buttonClass="p-2 border border-gray-300 rounded-l"
              dropdownClass="absolute z-10"
            />
          )}
        />
        {errors.contact && (
          <span className="text-red-500">{errors.contact.message}</span>
        )}
      </div> */}

      <div className="mb-4">
        <label htmlFor="email" className="block font-bold mb-1">
          Email
        </label>
        <div className="relative w-full">
          <input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="Enter your email id"
            {...register("email", {
              required: "Email id is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address format",
              },
            })}
            className="border border-gray-300 h-10 pl-12 pr-4 rounded-md w-full"
          />
          <EnvelopeIcon className={iconClassName} />
        </div>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="affiliation" className="block font-bold mb-1">
          Affiliation
        </label>
        <div className="w-full relative">
          <input
            id="affiliation"
            type="text"
            autoComplete="off"
            placeholder="Enter your institution name"
            {...register("affiliation", {
              required: "Affiliation is required",
            })}
            className="border border-gray-300 h-10 pl-12 pr-4 rounded-md w-full"
          />
          <BuildingLibraryIcon className={iconClassName} />
        </div>
        {errors.affiliation && (
          <span className="text-red-500">{errors.affiliation.message}</span>
        )}
      </div>

      <div className="mb-4 w-2/4 ">
        <label className="block font-bold mb-1">Pay in:</label>
        <div className="flex justify-around">
          <div className="flex items-center">
            <input
              id="currencyINR"
              type="radio"
              value="INR"
              {...register("currency", {
                required: "Currency type is required",
              })}
              className="mr-2"
            />
            <label htmlFor="currencyINR">INR</label>
          </div>
          <div className="flex items-center">
            <input
              id="currencyUSD"
              type="radio"
              value="USD"
              {...register("currency", {
                required: "Currency type is required",
              })}
              className="mr-2"
            />
            <label htmlFor="currencyUSD">USD</label>
          </div>
        </div>
        {errors.currency && (
          <span className="text-red-500">{errors.currency.message}</span>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="w-1/4 lg:w-1/6 p-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={progress === 1}
          onClick={reduceProgress}
        >
          Back
        </button>
        <button
          type="submit"
          className="w-1/4 lg:w-1/6 p-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {progress === 3 ? "Submit" : "Next"}
        </button>
      </div>
    </form>
  );
};

export default FormPartOne;
