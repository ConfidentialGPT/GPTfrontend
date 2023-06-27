import { createSlice } from '@reduxjs/toolkit'

export interface UserState {
  user: any
}

const initialState: UserState = {
  user: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, { payload }) => {
      state.user = payload
    }
  }
})

export const { setUserInfo } = userSlice.actions

export default userSlice.reducer
