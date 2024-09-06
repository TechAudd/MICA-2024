import { BASE_URL, CONVERSION_RATE } from "../../services/apiConstants";
import { apiSlice } from "./apiSlice";

interface IGetConversionRate {
  conversionRate: string;
}

const conversionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversionRate: builder.query<IGetConversionRate, void>({
      query: () => ({
        url: BASE_URL + CONVERSION_RATE,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetConversionRateQuery } = conversionApiSlice;
