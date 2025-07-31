import { useState } from "react";
import socket from "../socket/socket";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Message(){

    const [following_list,setFollowingList]=useState([])
    const [user_id,setUserId]=useState("")
    const [selected_user,setSelectedUser]=useState(null)
    const [transfered_messages,setTransferedMessages]=useState([])
    const navigate=useNavigate()

    useEffect(()=>{

        async function fetch_details() {
            fetch(`http://${import.meta.env.VITE_APP_URL}:3000/fetch_following`,{
                credentials:"include"
            })
            .then((res)=>res.json())
            .then((data)=>{
                setFollowingList(data.data)
                setUserId(data.user_id)
            })
        }

        fetch_details()
    },[])


    useEffect(()=>{
                async function fetch_msg_req(){
                fetch(`http://${import.meta.env.VITE_APP_URL}:3000/fetch_msg_req`,{
                    credentials:"include"
                })
                .then((res)=>res.json())
                .then((data)=>setFollowingList(prev=>[...prev,...data.rows]))
            }
        fetch_msg_req()
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



        socket.on("connect_error",(err)=>{
            console.log(err);
        })

        socket.on("receive",(msg)=>{
            setTransferedMessages((prev) => [
                ...prev,
                { sender: msg.sender,receiver:msg.receiver ,message: msg.message }
            ]);
        })
    },[user_id])



    const [message,setMessage]=useState("")

    function sendMessage(){        
        socket.emit("sent_message",{"sender":user_id,"receiver":selected_user.following_id,"message":message})
        setTransferedMessages((prev) => [
            ...prev,
            { sender: user_id,receiver:selected_user.following_id, message: message }
        ]);
        setMessage("")
    }

    function handleSelectedUser(follower){
        setSelectedUser(follower)

        fetch(`http://${import.meta.env.VITE_APP_URL}:3000/fetch_messages/${follower.following_id}`,{
            credentials:"include"
        })
        .then((res)=>res.json())
        .then((data)=>{            
            setTransferedMessages(data.rows)
        })
    }


    return(
        <div className="flex mt-10">
            <div className="w-1/3">
                {
                    following_list.map((follower,index)=>(
                        <div  key={index} className="cursor-pointer gap-3 bg-green-500 p-2 rounded text-white hover:bg-green-600 shadow-2xl flex items-center" onClick={()=>handleSelectedUser(follower)}>
                            <img className="h-10 w-10 rounded-full" src={follower.avatar_url}></img>
                            <h1 className="">{follower.following_id}</h1>
                        </div>
                    ))
                }
            </div>


            <div className="w-full ml-5 border-3 border-green-400 rounded">
                {
                    selected_user?
                    (<div className="flex flex-col justify-between">
                        <div className="flex gap-3 items-center p-2 border-2 border-green-400 cursor-pointer" onClick={()=>navigate(`/single_user_details/${selected_user.following_id}`)}>
                            <img src={selected_user.avatar_url} className="w-10 h-10 rounded-full"></img>
                            <h1>{selected_user.following_id}</h1>
                        </div>
                        <div className="rounded h-100 overflow-y-scroll px-2 py-4">
                            {
                                transfered_messages.map((msg,index)=>(
                                    <div key={index} className={`chat ${msg.sender===user_id?"chat-end":"chat-start"} overflow-y-hidden`}>
                                        <h1 className={`p-2 ${msg.sender===user_id?"chat-bubble chat-bubble-secondary":"chat-bubble chat-bubble-info"} rounded my-1 text-white`}>{msg.message}</h1>
                                    </div>

                                ))
                            }
                        </div>
                        <div className="flex justify-center border-2 p-2 border-green-400">
                            <input value={message} onChange={(e)=>setMessage(e.target.value)} type="text" className="py-1 px-3 border-none bg-white-400 shadow-2xl rounded w-full" placeholder="message here"></input>
                            <button className="bg-blue-500 py-1 px-3 rounded text-white" onClick={sendMessage}>Send</button>
                        </div>
                    </div>)

                    :

                    (<div className="flex justify-center items-center h-screen text-2xl font-serif font-bold">
                        <h1>Select a user to chat</h1>
                    </div>)
                }
            </div>


        </div>
    )
}