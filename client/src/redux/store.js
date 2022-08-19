import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/auth';
import { chatReducer } from './slices/chat';


export const store = configureStore({
	reducer:{
		auth: authReducer,
		chat: chatReducer,

	},
})