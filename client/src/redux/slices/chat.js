import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'


export const fetchFindAllUserChat = createAsyncThunk('users/findAllUserChat', async (data) => {
	const response = await axios.post('/findAllUserChat', { userId: data })
	return response.data
})
export const fetchFindMessages = createAsyncThunk('users/getMessages', async (data) => {
	const response = await axios.post('/getMessages', { chatId: data })
	return response.data
})
export const createChat = createAsyncThunk('chat/createChat', async (data) => {
	const response = await axios.post('/createChat', { name: data.value, usersId: data.usersId })
	return response
})
export const createDialog = createAsyncThunk('chat/createDialog', async (data) => {
	const response = await axios.post('/createDialog', { usersId: data.usersId })
	return response
})
export const changeChatName = createAsyncThunk('chat/createDialog', async (data) => {
	const response = await axios.post('/changeChatName', data)
	return response
})
export const deleteDialog = createAsyncThunk('chat/createDialog', async (data) => {
	const response = await axios.post('/deleteDialog', data)
	return response
})
export const setChatUsers = createAsyncThunk('chat/leaveChat', async (data) => {
	const response = await axios.post('/leaveChat', data)
	return response
})

const initialState = {
	LastChatsVisit: localStorage.getItem('LastChatsVisit') || "{}"
};

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setLastChatsVisit(state, chatId) {
			if (!chatId?.payload) {
				return
			}
			const newObj = JSON.parse(state.LastChatsVisit)
			newObj[chatId.payload] = String(Date.now() + 1)
			state.LastChatsVisit = JSON.stringify(newObj)
			localStorage.setItem('LastChatsVisit', JSON.stringify(newObj));
		}
	},
	extraReducers: {}
})
export const { setLastChatsVisit } = chatSlice.actions;

export const LastChatsVisit = (state) => JSON.parse(state.chat.LastChatsVisit)
export const chatReducer = chatSlice.reducer;