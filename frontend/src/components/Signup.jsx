import { useState } from 'react'
import logo from '../assets/logo.jpg'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'


export default function Signup() {

    const navigate = useNavigate()

    //used to check whether the entered email already exist
    function checkEmailExist(e) {
        if (data.email.length == 0) {
            alert("please enter valid email")
            return
        }
        e.preventDefault()
        fetch(`${import.meta.env.VITE_APP_URL}/check_exist`, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "email": data.email
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.exists) {
                    setAlertMessage("Account already exists on this email Id")
                    setShowError(true)
                    setTimeout(() => {
                        setShowError(false)
                        setAlertMessage("")
                    }, 2000)
                    return

                }
                //if email already not exist then show the username and password input field
                setTrack(track + 1)
            })
            .catch((err) => console.log(err))
    }

    //keep track of visibility of fields
    const [track, setTrack] = useState(0)

    //keep track of user entered data
    const [data, setData] = useState({
        "email": "",
        "password": "",
        "username": ""
    })

    //handle the inputs fields
    function inputHandler(e) {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    //check user weather username alredy exist and sent otp

    // function checkUsernameExist(e){
    //     if(data.username.length==0 || data.password.length==0){
    //         setShowWarning(true)
    //         setAlertMessage("Please fill the fields")

    //         setTimeout(()=>{
    //             setShowWarning(false)
    //             setAlertMessage("")
    //         },2000)
    //         return
    //     }
    //     e.preventDefault()
    //     fetch(`${import.meta.env.VITE_APP_URL}/check_username`,{
    //         method:"post",
    //         headers:{
    //             "content-type":"application/json"
    //         },
    //         body:JSON.stringify(data)
    //     })
    //     .then((res)=>res.json())
    //     .then((data)=>{
    //         //if username already exist
    //         if(data.exists){
    //             setShowWarning(true)
    //             setAlertMessage("This username already exists try different one")
    //         }
    //         setTimeout(()=>{
    //             setShowWarning(false)
    //             setAlertMessage("")
    //         },2000)

    //         //if username not already exist but otp not sent
    //         if(!data.exists && !data.otp_sent){
    //             setShowError(true)
    //             setAlertMessage("Error sending OTP")
    //             setTimeout(()=>{
    //                 setShowError(false)
    //                 setAlertMessage("")
    //             },2000)  
    //         }
    //         //if username not already exist and otp sent 
    //         if(!data.exists && data.otp_sent){
    //             setShowAlert(true)
    //             setAlertMessage("OTP sent successful")
    //             setTimeout(()=>{
    //                 setShowAlert(false)
    //                 setAlertMessage("")
    //             },2000)
    //             setTrack(track+1)
    //         }
    //     })
    //     .catch((err)=>{
    //             setShowError(true)
    //             setAlertMessage("Error")
    //             setTimeout(()=>{
    //                 setShowError(false)
    //                 setAlertMessage("")
    //             },2000)
    //     })
    // }

    function checkUsernameExist(e) {
        if (data.username.length == 0 || data.password.length == 0) {
            setShowWarning(true)
            setAlertMessage("Please fill the fields")

            setTimeout(() => {
                setShowWarning(false)
                setAlertMessage("")
            }, 2000)
            return
        }
        e.preventDefault()

        fetch(`${import.meta.env.VITE_APP_URL}/check_username`, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.exists) {
                    setShowWarning(true)
                    setAlertMessage("This username already exists, try a different one")
                    setTimeout(() => {
                        setShowWarning(false)
                        setAlertMessage("")
                    }, 2000)
                    return
                }

                if (response.success) {
                    setShowAlert(true)
                    setAlertMessage("Signup successful!")
                    setTimeout(() => {
                        setShowAlert(false)
                        setAlertMessage("")
                        navigate("/set_profile") // redirect to next step
                    }, 2000)
                } else {
                    setShowError(true)
                    setAlertMessage("Signup failed, try again")
                    setTimeout(() => {
                        setShowError(false)
                        setAlertMessage("")
                    }, 2000)
                }
            })
            .catch((err) => {
                setShowError(true)
                setAlertMessage("Server error")
                setTimeout(() => {
                    setShowError(false)
                    setAlertMessage("")
                }, 2000)
            })
    }


    //keep track of otp
    const [otp, setotp] = useState("")
    function otphandler(e) {
        setotp(e.target.value)
    }

    //verify otp if succes store data on db
    function verifyOtp(e) {

        e.preventDefault()
        if (otp.length == 0) {
            setShowWarning(true)
            setAlertMessage("Please enter valid OTP")
            setTimeout(() => {
                setShowWarning(false)
                setAlertMessage("")
            })
            return
        }

        //attach the received otp into body to send backend for verification
        data["received_otp"] = otp

        fetch(`${import.meta.env.VITE_APP_URL}/verify_otp`, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {


                    setShowAlert(true)
                    setAlertMessage("Signup successful")
                    setTimeout(() => {
                        setShowAlert(false)
                        setAlertMessage("")
                        navigate("/set_profile")
                    }, 2000)
                    return

                }
                if (!data.success) {
                    setShowError(true)
                    setAlertMessage("Invalid OTP")

                    setTimeout(() => {
                        setShowError(false)
                        setAlertMessage("")
                    }, 2000)
                    return
                }

            })
            .catch((err) => {
                setShowError(true)
                setAlertMessage("Error in signup")

                setTimeout(() => {
                    setShowError(false)
                    setAlertMessage("")
                })
            })
    }

    const [showAlert, setShowAlert] = useState(false)
    const [alert_message, setAlertMessage] = useState("")

    const [showerror, setShowError] = useState(false)
    const [showwarning, setShowWarning] = useState(false)

    return (
        <div className='w-full flex h-screen items-center justify-center font-serif bg-pink-600'>
            <div className='flex flex-col border-none p-15 gap-5 rounded-2xl bg-white'>
                <div className='self-center'>
                    <img className='h-20 w-30 rounded-2xl' src={logo}></img>
                </div>
                <div className='text-3xl flex justify-center mt-5'>
                    <h1>Signup</h1>
                </div>
                {
                    track == 0 &&
                    <form className='border-none border-pink-600 p-5 w-60 rounded-2xl flex flex-col gap-10'>
                        <div>
                            <input required className='border border-pink-600 p-2 rounded-2xl focus:scale-110 transition duration-400' type='email' placeholder='Enter Your Email' name='email' value={data.email} onChange={(e) => inputHandler(e)} />
                        </div>


                        <div className='self-center'>
                            <button className='border border-pink-600 p-2 rounded-2xl w-30 transition duration-300 hover:bg-pink-400 cursor-pointer' onClick={checkEmailExist}>Signup</button>
                        </div>
                    </form>
                }
                {

                    //initially hide username and password field if the entered email not already exist on db then show username and password field field
                    track == 1 &&
                    <form className='border-none border-pink-600 p-5 w-60 rounded-2xl flex flex-col gap-10'>
                        <div>
                            <input required className='border border-pink-600 p-2 rounded-2xl focus:scale-110 transition duration-400' type='text' placeholder='Enter User Name' name='username' value={data.username} onChange={(e) => inputHandler(e)} />
                        </div>
                        <div>
                            <input required className='border border-pink-600 p-2 rounded-2xl focus:scale-110 transition duration-400' type='password' placeholder='Enter Password' name='password' value={data.password} onChange={(e) => inputHandler(e)} />
                        </div>
                        <div className='self-center'>
                            <button className='border border-pink-600 p-2 rounded-2xl w-30 transition duration-300 hover:bg-pink-400 cursor-pointer' onClick={checkUsernameExist}>Sent OTP</button>
                        </div>
                    </form>

                }
                {/* {
                    track == 2 &&
                    <form className='border-none border-pink-600 p-5 w-60 rounded-2xl flex flex-col gap-10'>
                        <div>
                            <input required className='border border-pink-600 p-2 rounded-2xl focus:scale-110 transition duration-400' type='number' placeholder='Enter OTP' name='otp' onChange={(e) => otphandler(e)} />
                        </div>
                        <div className='self-center'>
                            <button className='border border-pink-600 p-2 rounded-2xl w-30 transition duration-300 hover:bg-pink-400 cursor-pointer' onClick={verifyOtp}>Signup</button>
                        </div>
                    </form>

                } */}

                <div className='flex justify-center'>
                    <Link to={"/"}>Already Have Account? <span className='text-blue-700'>Login</span></Link>
                </div>
            </div>


            {showAlert &&
                <div role="alert" className="alert alert-success fixed top-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{alert_message}</span>
                </div>
            }

            {showwarning &&
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


