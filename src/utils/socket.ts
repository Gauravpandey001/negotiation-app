import { io } from "socket.io-client";

const socket = io("https://negotiationbackend.onrender.com");

export default socket;
