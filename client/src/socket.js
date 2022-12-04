import { io } from "socket.io-client";

const URL = "online-chat-swart.vercel.app";

const socket = io(URL, { autoConnect: false });
export default socket 