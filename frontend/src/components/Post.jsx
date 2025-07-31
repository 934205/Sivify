import EmojiPicker from "emoji-picker-react"
import { useNavigate } from "react-router-dom"

import { useState } from "react"

export default function Post(){

    const navigate=useNavigate()

    const [posts,setPosts]=useState([])
    const [track,setTrack]=useState(0)
    const [caption,setCaption]=useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    function handleFile(){
        document.getElementById("post").click()
    }

    function handlePost(e){
        const selected = Array.from(e.target.files);
        setPosts(selected);
        if (selected.length > 0) setTrack(1);
    }

    function handleCaption(e){
        setCaption(e.target.value)
    }

    function onEmojiClick(e) {
        setCaption(prev => prev + e.emoji)
    }

    function uploadPost(){
        setLoading(true)
        const form=new FormData()

        posts.forEach(file => {
            form.append("post", file)
        });
        form.append("caption",caption)

        fetch(`http://${import.meta.env.VITE_APP_URL}:3000/upload_post`,{
            method:"post",
            body:form,
            credentials:"include"

        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.success){
                setShowAlert(true)
                setTimeout(()=>{
                    setShowAlert(false)
                    navigate("/home")
                },2000)
                
            }
            else{
                seterrShowAlert(true)
                setTimeout(()=>{
                    seterrShowAlert(false)
                },3000)
            }
        })
        .finally(()=>setLoading(false))

    }
    
    const [loading,setLoading]=useState(false)
    const [showAlert,setShowAlert]=useState(false)
    const [errshowAlert,seterrShowAlert]=useState(false)

    return(
            <div className="max-w-lg mx-auto flex flex-col items-center bg-white shadow-lg rounded-2xl gap-10 py-10 mt-10">
                <p>create new post</p>
                <input type="file" id="post" style={{display:"none"}} multiple onChange={handlePost} name="posts"></input>
                <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M38.5 5.5h-29c-2.2 0-4 1.8-4 4v29c0 2.2 1.8 4 4 4h29c2.2 0 4-1.8 4-4v-29c0-2.2-1.8-4-4-4" strokeWidth="1"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.5 35.6c2.1-1.8 6.8-5.1 9.6-5.1S33.5 37.2 40 42.2" strokeWidth="1"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M20.6 32.1c2.1-1.8 8.2-4.9 11.1-4.9s5.9 2.5 10.8 5.6" strokeWidth="1"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M33.7 27.6c.3 1.2-1.2 4.3-.7 6.7c.3 1.5 1.8 4.5 1.8 4.5m-18.7-8.2c-3.6 2.6 1.4 8.5 5.2 11.9" strokeWidth="1"/><circle cx="15.4" cy="15.8" r="3.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/></svg>
                {
                    track == 0 && <button id="upload_button" className="bg-blue-400 px-4 py-1 rounded text-white hover:bg-blue-500 cursor-pointer" onClick={handleFile}>Select from your device</button>
                }
                {
                    track == 1 && 
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex">
                            {posts.map((file, idx) => (
                            <img
                                key={idx}
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-20 h-20 object-cover rounded"
                            />
                            ))}
                        </div>
                        
                        <div className="my-5 flex flex-col items-center gap-5">
                            <textarea type="text" className="p-4" required placeholder="Caption here" onChange={handleCaption} value={caption}></textarea>
                            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-2xl">😊</button>
                            <button disabled={loading} className={`bg-pink-400 rounded hover:bg-pink-600 text-white py-2 px-6 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-600 cursor-pointer"}`} onClick={uploadPost}>
                                {loading?<span className="loading loading-spinner text-accent"></span>:"Post"}
                            </button>
                        </div>

                        {
                            showEmojiPicker && 
                            <div>
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                        }
                        
                        
                    </div>
                }

                { showAlert &&
                    <div role="alert" className="alert alert-success">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Your post has been uploaded!</span>
                    </div>
                }

                {
                    errshowAlert &&

                    <div role="alert" className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Error! post uploaded failed</span>
                    </div>

                }
            </div>
            
    )

    
}


