import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchFindAllUserChat = createAsyncThunk('users/findAllUserChat', async (data) => {
	const response = await axios.post('http://localhost:3001/findAllUserChat', { userId: data })
	return response.data
})
export const fetchFindMessages = createAsyncThunk('users/getMessages', async (data) => {
	const response = await axios.post('http://localhost:3001/getMessages', { chatId: data })
	return response.data
})
export const createChat = createAsyncThunk('users/createChat', async (data) => {
	const response = await axios.post('http://localhost:3001/createChat', { name: data.value, usersId: data.usersId })
	return response.data
})


const initialState = {};

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {},
	extraReducers: {}
})

export const chatReducer = chatSlice.reducer;