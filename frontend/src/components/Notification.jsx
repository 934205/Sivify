import { useEffect, useState } from "react"
import socket from "../socket/socket"
import { data } from "react-router-dom"
export default function Notification(){

    const [user_id,setUserId]=useState("")
    const [notifications,setNotifications]=useState([])

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_APP_URL}/current_user`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => setUserId(data.user_id));
    },[])

    useEffect(()=>{
        if(!user_id)return
        if(!socket.connected){
            socket.connect()
        }

        socket.on("connect",()=>{
            console.log("success");
            socket.emit("register",user_id)
        })

        socket.on("follow_request",(data)=>{
            setNotifications(prev => [data, ...prev])     
        })

        socket.on("like_notify",(data)=>{
            setNotifications(prev=>[data,...prev])
        })
    },[user_id])

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_APP_URL}/fetch_notifications`, {
            credentials: "include"
        })
        .then((res)=>res.json())
        .then((data)=>{            
            setNotifications(data.notifications)            
        })
    },[])


    function timeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diff = Math.floor((now - past) / 1000); // in seconds

        if (diff < 60) return `${diff} seconds ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    }

    return(
        <div className="overflow-y-auto mt-10">
            { 
            notifications && notifications.length > 0?
            (
                notifications.map((not,index)=>(

                    <div key={index} className="flex max-w-md mx-auto items-center gap-2 py-3 bg-white-400 shadow-2xl">
                        
                        <img className="rounded-full w-10 h-10" src={not.from_profile_pic}/>
                        <h1>{not.message}</h1>
                        <h1>{timeAgo(not.created_at)}</h1>
                    </div>
                ))
            ):
            
            (
                  <h1 className="text-center font-black text-xl sm:text-2xl">No Notifications</h1>  

            )
            }
        </div>
    )
}