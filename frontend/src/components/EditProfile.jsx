import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function EditProfile(){

    const navigate=useNavigate()


    const [data, setData] = useState({
        user_id: "",
        name: "",
        bio: "",
        public_id:"",
        avatar_url:""
    })

    useEffect(()=>{
        async function checkUsernameExist(){
            await fetch(`${import.meta.env.VITE_APP_URL}/check_username_exist`,{
                    method:"post",
                    credentials:"include",
                    body:JSON.stringify({
                        "user_id":data.user_id
                    }),
                    headers:{
                        "content-type":"application/json"
                    }
            })
            .then((res)=>res.json())
            .then((data)=>{
                if(data.exists){
                    alert("username already exist")
                }
                })
        }        
        checkUsernameExist()
    },[data.user_id])


    useEffect(()=>{ 
        async function fetch_user(){
            await fetch(`${import.meta.env.VITE_APP_URL}/fetch_user_details`,{
                credentials:"include"
            })
            .then((res)=>res.json())
            .then((data)=>{                
                            
                setData({
                    user_id: data.user_id,
                    name: data.name,
                    bio: data.bio,
                    public_id:data.avatar_public_id,
                    avatar_url: data.avatar_url
                });
            })
            
        }
        fetch_user()
    },[])

    

    const [profilePic,setProfilePic]=useState([])
    const [selectedPic,setSelectedPic]=useState(null)

    async function handleSubmit(){
        setLoading(true)

        const form=new FormData()
        form.append("name",data.name)
        form.append("bio",data.bio)
        form.append("public_id",data.public_id)
        if(profilePic){
            form.append("profile_pic",profilePic)
        }
        

        await fetch(`${import.meta.env.VITE_APP_URL}/edit_profile`,{
            method:"post",
            credentials:"include",
            body:form
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.success){
                setShowAlert(true)
                setAlertMessage("Success")

                setTimeout(()=>{
                    setShowAlert(false)
                    setAlertMessage("")
                    navigate("/profile")
                },2000)
            }
            else{
                setShowError(true)
                setAlertMessage("Success")

                setTimeout(()=>{
                    setShowError(false)
                    setAlertMessage("")
                    navigate("/profile")
                },2000)
            }
        })
        .finally(()=>{
            setLoading(false)
        }    
        )
    }

    function handleChange(e){
        const {name,value,files}=e.target
        if(name=="avatar_url"){
            setProfilePic(files[0])
            setSelectedPic(URL.createObjectURL(files[0]))
        }
        else{
            setData({
                ...data,[name]:value
            })
        }
    }

    const [showAlert,setShowAlert]=useState(false)
    const [alert_message,setAlertMessage]=useState("")
    const [loading,setLoading]=useState(false)

    const [showerror,setShowError]=useState(false)

    return(
        <div className="flex flex-col h-auto bg-white shadow-2xl items-center py-5 px-2 gap-5 max-w-md mx-auto">
            <label className="font-bold">name</label><input className="p-2 border-2 rounded" type="text" name="name" value={data.name} placeholder="name" onChange={handleChange}/>
            <label className="font-bold">bio</label><textarea className="p-2 border-2 rounded" type="text" name="bio" value={data.bio} placeholder="bio" onChange={handleChange}/>
            <input id="profilePic" onChange={handleChange} className="hidden" type="file" name="avatar_url"></input>
            <div className="flex flex-col items-center gap-5 cursor-pointer" onClick={()=>document.getElementById("profilePic").click()}>
                {
                    (selectedPic || data.avatar_url) &&
                    <img alt="siva" src={selectedPic || data.avatar_url} className="w-30 h-30 rounded-full"></img>
                }
                <button>change Profile picture</button>
            </div>
            <button className="bg-red-500 py-2 px-5 cursor-pointer rounded hover:bg-red-600 text-white" onClick={()=>navigate("/profile")}>Cancel</button>
            <button disabled={loading} className={`bg-pink-500 rounded hover:bg-pink-600 text-white py-2 px-6 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-600 cursor-pointer"}`} onClick={handleSubmit}>
                                {loading?<span className="loading loading-spinner text-accent"></span>:"Save"}
            </button> 


            { showAlert &&
                <div role="alert" className="alert alert-success fixed top-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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