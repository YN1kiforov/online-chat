import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://online-chat-mern.herokuapp.com/',
});

export default instance;