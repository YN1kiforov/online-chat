import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const sendMessage = createAsyncThunk('message/sendMessage', async (data) => {

	const { value, userId, currentChatId } = data;
	const content = value
	const chatId = currentChatId

	const response = await axios.post('/sendMessage', { content, userId, chatId })
	return response.data
})

const initialState = {};

const messageSlice = createSlice({
	name: 'message',
	initialState,
	reducers: {},
	extraReducers: {}
})

export const messageReducer = messageSlice.reducer;