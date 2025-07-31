import {io} from "socket.io-client"

const socket=io(`http://${import.meta.env.VITE_APP_URL}:3000`,{
    autoConnect:false,
    transports:["websocket"]
})

export default socket