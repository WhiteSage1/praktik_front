import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCreadentials } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log('baseQueryWithReauth args', args)
    // console.log('baseQueryWithReauth api', api)
    // console.log('baseQueryWithReauth extraOptions', extraOptions)
    
    let result = await baseQuery(args, api, extraOptions)
    
    // if you want to handle other status codes, do so here
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        
        if (refreshResult?.data) {

            // store the new token
            api.dispatch(setCreadentials({ ...refreshResult.data }))

            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = 'Your login has expired. Please login again.'
            }
            return refreshResult
        }
    }
    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Post', 'User'],
    endpoints: builder => ({})
})