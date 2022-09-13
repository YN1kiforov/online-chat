import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchAuth = createAsyncThunk('users/fetchAuth', async (data) => {
	const response = await axios.post('/login', data)
	return response.data
})
export const fetchRegistration = createAsyncThunk('users/fetchRegistration', async (data) => {
	const response = await axios.post('/registration', data)
	return response.data
})
const initialState = {
	userId: localStorage.getItem('userId') || null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.userId = null
			localStorage.removeItem('userId')
		}
	},
	extraReducers: {
		[fetchAuth.pending]: (state) => {
			state.data = null;
		},
		[fetchAuth.fulfilled]: (state, action) => {
			state.userId = action.payload;
			localStorage.setItem('userId', action.payload.userId);
		},
		[fetchAuth.rejected]: (state) => {
			state.data = null;
		},
		[fetchRegistration.pending]: (state) => {
			state.data = null;
		},
		[fetchRegistration.fulfilled]: (state, action) => {
			state.userId = action.payload;
			localStorage.setItem('userID', action.payload.userId);
		},
		[fetchRegistration.rejected]: (state) => {
			state.data = null;
		},
	}
})

export const { logout } = authSlice.actions;
export const UserId = (state) => state.auth.userId
export const authReducer = authSlice.reducer;