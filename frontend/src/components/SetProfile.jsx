import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import profilePic from '../assets/profile.jpg'
import EmojiPicker from "emoji-picker-react"
import { useNavigate } from "react-router-dom"

export default function SetProfile(){

    const navigate=useNavigate()
    const [data, setData] = useState({
        name: "",
        bio: "",
    })

    const [showEmojPicker,setShowEmojPicker]=useState(false)
    const [activeField, setActiveField] = useState(null)

        const [loading,setLoading]=useState(false)


    const [selectedProfilePic, setSelectedProfilePic] = useState(null);
    const [profileFile, setProfileFile] = useState(null);

    function handleChange(e){
        const {name,value,files}=e.target
        if(name=="profile"){
            setProfileFile(files[0])
            setSelectedProfilePic(URL.createObjectURL(files[0]))
        }
        else{
            setData({
                ...data,[name]:value
            })
        }
        
    }

    function onEmojiClick(e){
        if(!activeField)return

        setData(prev => ({
            ...prev,
            [activeField]: prev[activeField] + e.emoji
        }));
    }

    async function handleSave(){
        const form=new FormData()

        if(data.name =="" || data.bio=="" || profileFile==null){
            setShowWarning(true)
            setAlertMessage("Please fill all fields")

            setTimeout(()=>{
                setShowWarning(false)
                setAlertMessage("")
            },2000)
            return
        }

        setLoading(true)


        form.append("name",data.name)
        form.append("bio",data.bio)
        form.append("profile_pic",profileFile)

        console.log(profileFile);
        

        await fetch(`${import.meta.env.VITE_APP_URL}/set_profile`,{
            method:"post",
            credentials:"include",
            body:form
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.success){                
                setShowAlert(true)
                setAlertMessage("Profile setup success")
                setTimeout(()=>{
                    setShowAlert(false)
                    setAlertMessage("")
                    navigate("/home")
                },2000)
            }
            else{
                setShowError(true)
                setAlertMessage("profile setup fail")

                setTimeout(()=>{
                    setShowError(false)
                    setAlertMessage("")
                    navigate("/home")
                },2000)
                
            }
        })
        .finally(()=>setLoading(false))
        
    }


    const [showAlert,setShowAlert]=useState(false)
    const [alert_message,setAlertMessage]=useState("")

    const [showerror,setShowError]=useState(false)
    const [showwarning,setShowWarning]=useState(false)

    return(
        <div className="flex h-screen bg-white justify-center shadow-2xl flex-col items-center max-w-md mx-auto py-5 gap-10">
            <h1>Enter your details</h1>
            <input required className='border border-pink-600 p-2 rounded-2xl focus:scale-110 transition duration-400' onFocus={()=>setActiveField("name")} type="text" name="name" value={data.name || ""} placeholder="name" onChange={handleChange}></input>
            <textarea required className='border border-pink-600 p-5 rounded-2xl focus:scale-110 transition duration-400' onFocus={()=>setActiveField("bio")} type="text" name="bio" value={data.bio || ""} placeholder="bio" onChange={handleChange}></textarea>
            <button onClick={()=>setShowEmojPicker(!showEmojPicker)}>😊</button>
            <input required className="hidden" onChange={handleChange} type="file" name="profile" id="profile_selector"></input>
            {
                showEmojPicker && 
                <EmojiPicker onEmojiClick={onEmojiClick}/>
            }
            <button className="flex flex-col items-center" onClick={()=>{document.getElementById("profile_selector").click()}}><img className="w-20 h-20 cursor-pointer rounded-full" src={selectedProfilePic || profilePic}/>Upload Profile Picture</button>

            <button disabled={loading} className={`bg-pink-400 rounded hover:bg-pink-600 text-white py-2 px-6 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-600 cursor-pointer"}`} onClick={handleSave}>
                {loading?<span className="loading loading-spinner text-accent"></span>:"Post"}
            </button>



            { showAlert &&
                <div role="alert" className="alert alert-success fixed top-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{alert_message}</span>
                </div>
            }

            { showwarning &&
                <div role="alert" className="alert alert-warning fixed top-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{alert_message}</span>
                </div>
            }

            {
                showerror &&

                <div role="alert" className="alert alert-error fixed top-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{alert_message}</span>
                </div>
            }
        </div>
    )
}