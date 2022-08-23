import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/auth';
import { chatReducer } from './slices/chat';
import { messageReducer } from './slices/message';
import { userReducer } from './slices/users';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		chat: chatReducer,
		message: messageReducer,
		user: userReducer,
	},
})