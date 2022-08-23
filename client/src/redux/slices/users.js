import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {}

export const fetchAllUsers = createAsyncThunk('users/fetchByIdStatus', async () => {
	const response = await axios.get('http://localhost:3001/allUsers')
	return response.data
})

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
})

export const userReducer = userSlice.reducer;