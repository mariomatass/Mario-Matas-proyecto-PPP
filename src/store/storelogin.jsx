import { createSlice } from '@reduxjs/toolkit'
const initialAuthState = {
    isAutenticated: false,
    userName: '',
    userRol: '',
    userId: ''
}
const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login: (state, action) => {
            const userData = action.payload
            state.isAutenticated = true
            state.userName = userData.name
            state.userRol = userData.rol
            state.userId = userData.id
        },
        logout: (state) => {
            state.isAutenticated = false
            state.userName = ''
            state.userRol = ''
            state.userId = ''
        }
    }
})
export const loginActions = authSlice.actions
export const loginReducer = authSlice.reducer;
export default authSlice.reducer