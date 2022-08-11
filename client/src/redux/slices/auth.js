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
	reducers: {},

})

export const userId = localStorage.getItem('userId')
export const authReducer = authSlice.reducer;