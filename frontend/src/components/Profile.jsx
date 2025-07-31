import { useEffect, useState } from 'react'
import PostCard from './PostCard'
import { useNavigate } from "react-router-dom"
import Post from './Post'


export default function Profile(){
    const [user,setUser]=useState({})

    useEffect(()=>{

        fetch(`http://${import.meta.env.VITE_APP_URL}:3000/profile`,{
            credentials:"include"
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(!data.success){
                navigate("/")
            }
            else{                                                
                setUser(data.user)
            }
        })
        .catch((err)=>console.log(err))
    },[])


    useEffect(()=>{
        if(!user.user_id)return
            fetch(`http://${import.meta.env.VITE_APP_URL}:3000/fetch_single_user_posts/${user.user_id}`,{
            credentials:"include"
        })
        .then((res)=>res.json())
        .then((data)=>{            
            setPosts(data.rows)})
    },[user.user_id])

    const navigate=useNavigate()


    

    const [posts,setPosts]=useState([])

    //handle logout process
    function logout(){
        fetch(`http://${import.meta.env.VITE_APP_URL}:3000/logout`,{
            credentials:"include"
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.success){
                navigate("/")
            }
        })
    }

    const[selected_post,setSelectedPost]=useState(null)
    const [showmodal,setShowModal]=useState(false)

    return(
        <div className='flex flex-col mt-10'>
            <div className="py-10 px-10 bg-white shadow-2xl flex justify-around">
                <img src={user.avatar_url} className='rounded-full max-w-[150px] max-h-[150px]'></img>

                <div className="flex flex-col justify-around items-center gap-5">
                    <div className='max-w-md text-center flex flex-col gap-2'>
                            <h1 className='font-bold text-2xl font-serif'>{user.user_id}</h1>

                            <p>{user.name}</p>
                        
                             <p>{user.bio}</p>
                    </div>
                    <div className='flex gap-10'> 
                            <div className='flex flex-col items-center'>
                                <button>posts</button>
                                <h1>{user.no_posts}</h1>
                            </div>
                            <div className='flex flex-col items-center'>
                                <button>followers</button>
                                <h1>{user.no_followers}</h1>
                            </div>
                            <div className='flex flex-col items-center'>
                                <button>following</button>
                                <h1>{user.no_following}</h1>
                            </div>
                            
                    </div>

                </div>
                
                <div className=' flex w-auto gap-2 justify-between items-center'>
                    <button className='bg-blue-400 px-4 py-2 border-none text-white rounded-sm cursor-pointer hover:bg-blue-200' onClick={()=>navigate("/edit_profile")}>Edit Profile</button>
                    <button className='bg-red-400 px-4 py-2 border-none text-white rounded-sm cursor-pointer hover:bg-red-200' onClick={()=>setShowModal(true)}>Logout</button>
                </div>
            </div>

            
                
                <div className="grid grid-cols-3 gap-2 p-2 items-center">
                    {
                        
                        posts.map((post,index)=>(
                            <label key={index} htmlFor="post_modal">
                                <div key={index} onClick={()=>{
                                                                        
                                    setSelectedPost(post)}}>
                                    <img className='w-full h-full cursor-pointer' src={post.file_urls[0]}></img>
                                </div>
                            </label>
                            
                        ))
                        
                        
                    }
                </div>

                    {
                        selected_post &&

                        <div>
                            <input type="checkbox" id="post_modal" className="modal-toggle" />
                            <div className="modal" role="dialog">
                                <div className="modal-box">
                                    <h3 className="text-lg font-bold"></h3>
                                    <PostCard post={selected_post}/>
                                
                                </div>
                                <label className="modal-backdrop" htmlFor="post_modal">Close</label>
                            </div>
                        </div>
                    }


        {
        showmodal &&

        <div>
            <input type="checkbox" id={"logout"} className="modal-toggle" />

            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="text-lg font-bold">Do you want to logout?</h3>
                    
                    <div className="modal-action">
                        <div className="flex justify-center gap-5 mt-5">
                        <button className="btn btn-success" onClick={()=>setShowModal(false)}>No</button>
                        <button onClick={
                            logout
                            } className="btn btn-error">Yes</button>  
                        </div>
                    </div>
                </div>
                <label className="modal-backdrop" htmlFor={"logout"}></label>
                </div>
            </div>
        }



                    
            

            
        </div>
    )
}