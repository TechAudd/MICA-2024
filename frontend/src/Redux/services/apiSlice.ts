import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../services/apiConstants'

const baseQuery = fetchBaseQuery({
    baseUrl:BASE_URL,
    credentials:"include",
})

export const apiSlice = createApi({
    baseQuery,
    tagTypes:['attendees'],
    endpoints:() => ({})
})
