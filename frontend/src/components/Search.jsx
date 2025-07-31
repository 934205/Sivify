import { useEffect } from "react";
import { useState,useRef } from "react"
import logo from '../assets/logo.jpg'
import { data, useNavigate } from "react-router-dom";
export default function Search(){
    const [username,setUsername]=useState("")
    const [users,setUsers]=useState([])
    const navigate=useNavigate()

    useEffect(()=>{

        if(username.trim() === ""){
            setUsers([])
            return
        }

        async function fetchUsers() {
            await fetch(`${import.meta.env.VITE_APP_URL}/search?username=${username}`,{
            credentials:"include"
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.found){                                
                setUsers(data.users)
            }
        })        
    }

    fetchUsers();

    },[username])

    function handleChange(e){
        setUsername(e.target.value)        
    }

    function clearUsers(){
        setUsers([])
        setUsername("")
    }
    return(
        <div className="max-w-lg flex-col p-2 mx-auto bg-white shadow-2xl rounded-xl mt-10">
            
                <label className="flex justify-around items-center">
                    <input className="p-2 w-full focus:scale-101 transition duration-400"  type="text" value={username} onChange={handleChange} placeholder="Search People"/>
                    <svg className="cursor-pointer" onClick={clearUsers} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                </label>    
                    {
                        users.map((user,index)=>(
                            <div className="flex gap-3 my-3 py-3 cursor-pointer" key={index} onClick={()=>navigate(`/single_user_details/${user.user_id}`)}>
                                <img src={user.avatar_url} className="rounded-full w-10 h-10 bg-cover"/>
                                <div>
                                    <p className="font-bold">{user.user_id}</p>
                                    <p>{user.name}</p>
                                </div>
                            </div>
                        ))
                    }
        </div>
    )
}
