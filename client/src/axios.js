import axios from 'axios'

console.log(`url = ${process.env.REACT_APP_API_URL}`)
const instance = axios.create({
	baseURL: 'https://online-chat-mern.herokuapp.com'
})


export default instance;