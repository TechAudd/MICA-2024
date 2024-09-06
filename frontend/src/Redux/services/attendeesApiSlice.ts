import { BASE_URL,GET_ALL_REGISTERS } from "../../services/apiConstants";
import { IGetRegistrationDetails } from "../../types/types";
import { apiSlice } from "./apiSlice";

interface IGetRegistrationDetailsBody {
    page:number
}

const registerApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) =>({
        getRegistrations:builder.query<IGetRegistrationDetails,IGetRegistrationDetailsBody>({
            query:({page}) => ({
                url:BASE_URL+"/"+GET_ALL_REGISTERS,
                params:{page}
            }),
            keepUnusedDataFor:5
        })
    })
})

export const {
    useGetRegistrationsQuery
} = registerApiSlice