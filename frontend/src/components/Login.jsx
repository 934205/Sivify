import { useState } from 'react'
import logo from '../assets/logo.jpg'
import { useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'


export default function Login(){

    const navigate=useNavigate()

    //keep user data
    const [data,setData]=useState({
        "email":"",
        "password":""
    })

    //handle the data entered by user
    function inputHandler(e){
        setData({...data,[e.target.name]:e.target.value})
    }

    //check weather the user already exist or not if exist navigate to home page
    function loginHandler(e){
        e.preventDefault()

        if(data.password.length ==0 || data.email.length ==0){
            setShowError(true)
            setAlertMessage("Please fill all fields")
            setTimeout(()=>{
                setShowError(false)
                setAlertMessage("")

            },2000)
            return
        }

        if(data.password.length<4){
            setShowError(true)
            setAlertMessage("Password must contains atleast 4 characters")
            setTimeout(()=>{
                setShowError(false)
                setAlertMessage("")

            },2000)
            return
        }

        fetch(`http://${import.meta.env.VITE_APP_URL}:3000/login`,{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(data),
            credentials:"include"
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.exists){
                setShowAlert(true)
                setTimeout(()=>{
                    setShowAlert(false)
                    navigate("/home")
                },2000)
                setData({
                    "email":"",
                    "password":""
                })
                
            }
            else{
                setShowError(true)
                setAlertMessage("Invalid Username or Password")
                setTimeout(()=>{
                    setShowError(false)
                    setAlertMessage("")
                },2000)
            }
        })

    }
    const[showAlert,setShowAlert]=useState(false)
    const [showerror,setShowError]=useState(false)
    const [alert_message,setAlertMessage]=useState("")
    return(
        <div className='flex h-screen items-center justify-center font-serif bg-pink-600'>
            
            <div className='flex flex-col border-none p-15 gap-5 rounded-2xl bg-white'>
                <div className='self-center'>
                    <img className='h-20 w-30 rounded-2xl' src={logo}></img>
                </div>
                <div className='mt-5 text-3xl flex justify-center'>
                    <h1>Login</h1>
                </div>
                <form className='border-none border-pink-600 p-5 w-60 rounded-2xl flex flex-col gap-10'>
                    <div>
                        <input className='border border-pink-600 p-2 rounded-2xl focus:scale-110 transition duration-400' type='text' placeholder='Enter Your Email' name='email'value={data.email} onChange={(e)=>inputHandler(e)}/>
                    </div>
                    <div>
                        <input className='border border-pink-600 p-2 rounded-2xl focus:scale-110 transition duration-400' type='password' placeholder='Enter Password' name='password' value={data.password} onChange={(e)=>inputHandler(e)}/>
                    </div>
                    <div className='self-center'>
                    <button className='border border-pink-600 p-2 rounded-2xl w-30 transition duration-300 hover:bg-pink-400 cursor-pointer' onClick={loginHandler}>Login</button>
                    </div>
                </form>
                <div className='flex justify-center'>
                    <Link to={"/signup"}>Don't Have Account? <span className='text-blue-700'>Signup</span> </Link>
                </div>
            </div>

            { showAlert &&
                <div role="alert" className="alert alert-success fixed top-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Login success!</span>
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

