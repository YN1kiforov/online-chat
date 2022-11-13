import { io } from "socket.io-client";

const URL = "https://online-chat-mern.herokuapp.com";

const socket = io(URL, { autoConnect: false });
export default socket 