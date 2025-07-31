import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from '../assets/logo.jpg'
import PostCard from "./PostCard"
import socket from "../socket/socket"

export default function Home(){


    const [posts,setPosts]=useState([])
    const [user_id,setUserId]=useState()

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_APP_URL}/current_user`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => setUserId(data.user_id));
    },[])

    const navigate=useNavigate()

    useEffect(()=>{
        if(!user_id)return
        if(!socket.connected){
            socket.connect()
        }

        socket.on("connect",()=>{
            console.log("success");
            socket.emit("register",user_id)
        })
    },[user_id])


    useEffect(()=>{
        fetch(`${import.meta.env.VITE_APP_URL}/home`,{
            credentials:"include"
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(!data.success){
                navigate("/")
            }
        })
        .catch((err)=>console.log(err))
    },[])

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_APP_URL}/fetch_posts`,{
            credentials:"include"
        })
        .then((res)=>res.json())
        .then((data)=>{                        
            setPosts(data.posts)
        })
    },[])


    
    return(
        <div className="mt-10">
            {
                posts.map((post,index)=>(
                    <PostCard key={index} post={post} />
                ))
            }
             
        </div>
    )
}