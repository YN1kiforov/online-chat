import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://online-chat-swart.vercel.app/',
});

export default instance;