import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAuth = createAsyncThunk('users/fetchByIdStatus', async (data) => {
	console.log(`data => ${JSON.stringify(data)}`)
	const response = await axios.post('http://localhost:3001/login', data)
	console.log(response)
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
export const authReducer = authSlice.reducer;