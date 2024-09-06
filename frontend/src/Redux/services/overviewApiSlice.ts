import { REGISTER_COUNT, REGISTER_REVENU, BASE_URL } from './../../services/apiConstants';
import { apiSlice } from './apiSlice';
import { IRevenueResponse, OverviewResponseData } from '../../types/types';

const overViewApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        getRegisterCount :builder.query<OverviewResponseData , void>({
            query:()=>({
                url : BASE_URL+REGISTER_COUNT,
            }),
            keepUnusedDataFor:5
        }),
        getRegisterRevenue:builder.query<IRevenueResponse , void>({
            query:()=>({
                url:BASE_URL+REGISTER_REVENU
            }),

            keepUnusedDataFor:5
        })
    })
})

export const {useGetRegisterCountQuery , useGetRegisterRevenueQuery} = overViewApiSlice