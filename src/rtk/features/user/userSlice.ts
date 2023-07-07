import { createSlice } from '@reduxjs/toolkit'

export interface UserState {
  id?: number
  role?: number
}

const initialState: UserState = {}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, { payload }) => {
      state = payload
    }
  }
})

export const { setUserInfo } = userSlice.actions

export default userSlice.reducer
