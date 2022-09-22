import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

const initialState = {}

export const fetchAllUsers = createAsyncThunk('users/fetchByIdStatus', async (page) => {
	
	const response = await axios.get(`/allUsers?page=${page}&limit=27`)
	return response.data
})
export const setUserName = createAsyncThunk('users/setUserName', async (data) => {
	const response = await axios.post('/setUserName')
	return response.data
})
export const getUser = createAsyncThunk('users/getUser', async (data) => {
	const response = await axios.post('/getUser', {userId: data})
	return response.data
})
const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
})

export const userReducer = userSlice.reducer;