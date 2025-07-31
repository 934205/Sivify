import { useState } from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import PostCard from "./PostCard"

export default function SingleUser(){

    const [data,setData]=useState([])

    const {user_id}=useParams()

    const [isFollower,setIsFollower]=useState(false)

    const [loggedInUser, setLoggedInUser] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_URL}/current_user`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => setLoggedInUser(data.user_id));
    },[]);

    useEffect(()=>{
            fetch(`${import.meta.env.VITE_APP_URL}/fetch_single_user_posts/${user_id}`,{
            credentials:"include"
        })
        .then((res)=>res.json())
        .then((data)=>{            
            setPosts(data.rows)})
    },[])

    const [posts,setPosts]=useState([])
    

    useEffect(()=>{
        function fetch_user(){            
            fetch(`${import.meta.env.VITE_APP_URL}/fetch_single_user_profile/${user_id}`,{
                credentials:"include"
            })
            .then((res)=>res.json())
            .then((data)=>setData(data))
        }
        fetch_user()
    },[user_id,isFollower])

    useEffect(()=>{
        if(!user_id)return

        
        fetch(`${import.meta.env.VITE_APP_URL}/is_follower`,{
            credentials:"include",
            method:"post",
            body:JSON.stringify({"following_id":user_id}),
            headers:{
                "content-type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>setIsFollower(data.is_follower))


    },[user_id])


    function followRequest(){
        const url = isFollower ? `${import.meta.env.VITE_APP_URL}/unfollow` : `${import.meta.env.VITE_APP_URL}/follow`

        fetch(url,{
            method:"post",
            credentials:"include",
            body:JSON.stringify({"following_id":user_id}),
            headers:{
                "content-type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setIsFollower(!isFollower)
        })
    }

    const[selected_post,setSelectedPost]=useState(null)

    return(
        <div className='flex flex-col w-6xl mx-auto mt-10'>
            <div className="py-10 px-10 bg-white shadow-2xl flex justify-around items-center">
                <img src={data.avatar_url} className='rounded-full w-50 h-50'></img>

                <div className="flex flex-col justify-around items-center gap-5">
                    <div className='max-w-md text-center flex flex-col gap-2'>
                            <h1 className='font-bold text-2xl font-serif'>{data.user_id}</h1>

                            <p>{data.name}</p>
                        
                             <p>{data.bio}</p>
                    </div>
                    <div className='flex gap-10'> 
                            <div className='flex flex-col items-center'>
                                <button>posts</button>
                                <h1>{data.no_posts}</h1>
                            </div>
                            <div className='flex flex-col items-center'>
                                <button>followers</button>
                                <h1>{data.no_followers}</h1>
                            </div>
                            <div className='flex flex-col items-center'>
                                <button>following</button>
                                <h1>{data.no_following}</h1>
                            </div>
                            
                    </div>

                </div>
                
                <div className=' flex w-auto gap-2 justify-between items-center'>
                    {
                        (loggedInUser !== user_id) &&
                        ( isFollower?
                        <button className='bg-green-400 text-white px-4 py-2 border-none  rounded-sm cursor-pointer hover:bg-green-200' onClick={followRequest}>following</button> :
                        <button className='bg-blue-400 px-4 py-2 border-none text-white rounded-sm cursor-pointer hover:bg-blue-200' onClick={followRequest}>follow</button>
                        )
                    }
                    
                </div>
                
            </div>

            
                
                <div className="grid grid-cols-3 gap-2 p-2 items-center">
                    {
                        
                        posts.map((post,index)=>(
                            <label key={index} htmlFor="post_modal">
                                <div key={index} onClick={()=>setSelectedPost(post)}>
                                { post.file_urls[0].includes("/image/") && <img className='w-full h-full cursor-pointer' src={post.file_urls[0]}/>}
                                { post.file_urls[0].includes("/video/") && <video controls muted autoPlay loop className='w-full h-full cursor-pointer' src={post.file_urls[0]}/>}
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
        </div>
    )
}