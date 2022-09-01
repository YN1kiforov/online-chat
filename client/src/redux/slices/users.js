import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {}

export const fetchAllUsers = createAsyncThunk('users/fetchByIdStatus', async () => {
	const response = await axios.get('http://localhost:3001/allUsers')
	return response.data
})
export const setUserName = createAsyncThunk('users/setUserName', async (data) => {
	const response = await axios.post('http://localhost:3001/setUserName')
	return response.data
})
export const getUser = createAsyncThunk('users/getUser', async (data) => {
	const response = await axios.post('http://localhost:3001/getUser',{userId: data.userId})
	return response.data
})
const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
})

export const userReducer = userSlice.reducer;