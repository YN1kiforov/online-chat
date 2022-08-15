import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAuth = createAsyncThunk('users/fetchAuth', async (data) => {
	const response = await axios.post('http://localhost:3001/login', data)
	return response.data
})
export const fetchRegistration = createAsyncThunk('users/fetchRegistration', async (data) => {
	const response = await axios.post('http://localhost:3001/registration', data)
	return response.data
})
const initialState = {
	data: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null
		}
	},
	extraReducers: {
		[fetchAuth.pending]: (state) => {
			state.data = null;
		},
		[fetchAuth.fulfilled]: (state, action) => {
			state.data = action.payload;
		},
		[fetchAuth.rejected]: (state) => {
			state.data = null;
		},
	}
})

export const { logout } = authSlice.actions;
export const userId = (state) => state.auth.data
export const authReducer = authSlice.reducer;