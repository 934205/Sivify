import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {

const navigate=useNavigate()
  const [current, setCurrent] = useState(0);
  const images = post.file_urls; 
  const [showmodal,setShowModal]=useState(false)

  
  

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function handleLike(post_id,user_id) {
  const isLiked = liked_posts.includes(post_id);

  fetch(`http://${import.meta.env.VITE_APP_URL}:3000/like`, {
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      post_id,
      unlike: isLiked,
      user_id
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if(data.success) {
        setLikedPosts((prev) =>
          isLiked ? prev.filter((id) => id !== post_id) : [...prev, post_id]
        );
      }
    });
}

  const [liked_posts,setLikedPosts]=useState([])

  useEffect(()=>{
    fetch(`http://${import.meta.env.VITE_APP_URL}:3000/fetch_likes`,{
      credentials:"include"
    })
    .then((res)=>res.json())
    .then((data)=>{
      setLikedPosts(data.liked_posts)
    })
  },[])



  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
        fetch(`http://${import.meta.env.VITE_APP_URL}:3000/current_user`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => setLoggedInUser(data.user_id));
    },[]);


    const [isFollower,setIsFollower]=useState(false)

    useEffect(()=>{
        
        fetch(`http://${import.meta.env.VITE_APP_URL}:3000/is_follower`,{
            credentials:"include",
            method:"post",
            body:JSON.stringify({"following_id":post.user_id}),
            headers:{
                "content-type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>setIsFollower(data.is_follower))

    },[isFollower])


    function followRequest(){
        const url = isFollower ? `http://${import.meta.env.VITE_APP_URL}:3000/unfollow` : `http://${import.meta.env.VITE_APP_URL}:3000/follow`

        fetch(url,{
            method:"post",
            credentials:"include",
            body:JSON.stringify({"following_id":post.user_id}),
            headers:{
                "content-type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setIsFollower(!isFollower)
        })
    }

    function deletePost(){
      setShowModal(!showmodal)
      fetch(`http://${import.meta.env.VITE_APP_URL}:3000/delete_post/${post.post_id}`,{
            credentials:"include",
            method:"post",
            body:JSON.stringify({"following_id":post.user_id}),
            headers:{
                "content-type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
          if(data.success){
            setShowAlert(true)
            setTimeout(()=>{
              setShowAlert(false)
            },3000)
          }
        })
    }

    const [showAlert,setShowAlert]=useState(false)


  return (
    <div className="max-w-md bg-white shadow-lg rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>navigate(`/single_user_details/${post.user_id}`)}>
          <img src={post.avatar_url} className="w-10 h-10 rounded-full" />
          <h1 className="text-xl">{post.user_id}</h1>
        </div>
        {loggedInUser !== post.user_id?( isFollower?
                        <button className='bg-green-400 px-4 py-2 border-none text-white rounded-sm cursor-pointer hover:bg-green-500'>following</button> 
                        : ""       
                        )
        :
          <button onClick={()=>setShowModal(!showmodal)} className="px-4 py-1 text-white rounded bg-red-500 hover:bg-red-700 cursor-pointer">Delete</button>
        }
      </div>

      <div className="relative w-full h-72 flex items-center justify-center mt-4">
        <button onClick={prev} className="absolute left-0  p-2 rounded-full">◀</button>
        {
          images[current].includes("/video/") && <video controls autoPlay muted loop src={images[current]} className="w-full h-full rounded" />
        }
        {
          images[current].includes("/image/") && <img controls autoPlay muted loop src={images[current]} className="w-full h-full rounded" />
        }
        
        <button onClick={next} className="absolute right-0 p-2 rounded-full">▶</button>
      </div>

      <div className="flex gap-3 py-2">
        
        {
          liked_posts.includes(post.post_id)?
          <svg className="hover:cursor-pointer" onClick={()=>handleLike(post.post_id,post.user_id)} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48"><path fill="#f44336" d="M34 9c-4.2 0-7.9 2.1-10 5.4C21.9 11.1 18.2 9 14 9C7.4 9 2 14.4 2 21c0 11.9 22 24 22 24s22-12 22-24c0-6.6-5.4-12-12-12"/></svg>
          :
          <svg className="hover:cursor-pointer" onClick={()=>handleLike(post.post_id,post.user_id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"/></svg>
        }
        
      </div>

      <div className="mt-2">
        <p><span className="font-bold mr-2">{post.user_id}</span>{post.caption}</p>
        <p className="text-sm text-gray-500">{timeAgo(post.created_at)}</p>
      </div>



      {
        showmodal &&

        <div>
            <input type="checkbox" id={`delete_modal${post.post_id}`} className="modal-toggle" />

            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="text-lg font-bold">Do you want to delete your post?</h3>
                
                <div className="modal-action">
                    <div className="flex justify-center gap-5 mt-5">
                      <button className="btn btn-success" onClick={()=>setShowModal(false)}>No</button>
                      <button onClick={
                        deletePost
                        } className="btn btn-error">Yes</button>  
                    </div>
                </div>
              </div>
              <label className="modal-backdrop" htmlFor={`delete_modal${post.post_id}`}></label>
            </div>
        </div>
      }


      { showAlert &&
        <div role="alert" className="alert alert-success fixed top-20 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your post has been deleted!</span>
        </div>
      }



            
   </div> 
  );
}
