import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null },
    reducers: {
        setCreadentials: (state, action) => {
            const { accessToken, username } = action.payload
            state.token = accessToken
            state.user = username
        },
        logout: (state) => {
            state.user = null
            state.token = null
        }
    }
})

export const { setCreadentials, logout } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentUser = (state) => state.auth.user