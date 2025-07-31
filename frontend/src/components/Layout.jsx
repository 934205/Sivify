import { Link, Outlet } from "react-router-dom"

export default function Layout(){
    return(
        <div className="flex flex-col-reverse sm:flex-row h-screen">
            <div className="flex sm:flex-col p-5 justify-around rounded-2xl shadow-2xl">
                
         
                    <Link to={'/home'} className="flex px-5 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="16" strokeDashoffset="16" d="M4.5 21.5h15"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/></path><path strokeDasharray="16" strokeDashoffset="16" d="M4.5 21.5v-13.5M19.5 21.5v-13.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="16;0"/></path><path strokeDasharray="28" strokeDashoffset="28" d="M2 10l10 -8l10 8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="28;0"/></path><path strokeDasharray="24" strokeDashoffset="24" d="M9.5 21.5v-9h5v9"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.4s" values="24;0"/></path></g></svg> 
                        <span className="hidden sm:flex sm:px-2">Home</span>
                    </Link>
       
                    <Link to={'/search'} className="flex px-5 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="40" strokeDashoffset="40" d="M10.76 13.24c-2.34 -2.34 -2.34 -6.14 0 -8.49c2.34 -2.34 6.14 -2.34 8.49 0c2.34 2.34 2.34 6.14 0 8.49c-2.34 2.34 -6.14 2.34 -8.49 0Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="40;0"/></path><path strokeDasharray="12" strokeDashoffset="12" d="M10.5 13.5l-7.5 7.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="12;0"/></path></g></svg>
                        <span className="hidden sm:flex sm:px-2">Search</span>
                    </Link>
          
                    <Link to={'/message'} className="flex px-5 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.5" d="M3 20.29V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7.961a2 2 0 0 0-1.561.75l-2.331 2.914A.6.6 0 0 1 3 20.29Z"/></svg>
                        <span className="hidden sm:px-2 sm:flex">Message</span>
                    </Link>
                
                    <Link to={'/notification'} className="flex px-5 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 36 36"><path fill="currentColor" d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.6 12.6 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.6 12.6 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75M5.13 28.94a16.2 16.2 0 0 0 2.44-3a14.2 14.2 0 0 0 1.65-5.85v-4.94a8.74 8.74 0 1 1 17.47 0v4.94a14.2 14.2 0 0 0 1.65 5.85a16.2 16.2 0 0 0 2.44 3Z" className="clr-i-outline clr-i-outline-path-1"/><path fill="currentColor" d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28" className="clr-i-outline clr-i-outline-path-2"/><path fill="none" d="M0 0h36v36H0z"/></svg>
                        <span className="hidden sm:px-2 sm:flex">Notification</span>
                    </Link>
                    
                    <Link to={'/post'} className="flex px-5 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd" clipRule="evenodd"><path fill="currentColor" d="M10.75 10.75V7.5h2.5v3.25h3.25v2.5h-3.25v3.25h-2.5v-3.25H7.5v-2.5z"/><path fill="currentColor" d="M12 3a9 9 0 1 1-9 9H1c0 6.075 4.925 11 11 11s11-4.925 11-11S18.075 1 12 1zm-8.82 7.199a9 9 0 0 1 .72-2.126l-1.8-.874a11 11 0 0 0-.88 2.602zm3.42-5.4a9 9 0 0 0-1.8 1.8L3.2 5.4a11 11 0 0 1 2.2-2.2l1.2 1.6Zm1.473-.9a9 9 0 0 1 2.126-.719l-.398-1.96c-.914.185-1.786.484-2.602.88z"/></g></svg>
                        <span className="hidden sm:px-2 sm:flex">Create</span>
                    </Link>
                    
                    <Link to={'/profile'} className="flex px-5 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="7" r="3"/></g></svg>
                        <span className="hidden sm:px-2 sm:flex">Profile</span>
                    </Link>
            </div>
            <div className="h-full p-5 overflow-y-auto w-full">
                <div className="bg-pink-600 h-15 w-full fixed z-1 top-0 flex items-center justify-center text-2xl text-white font-serif">
                    <h1>Sivify</h1>
                </div>
                <Outlet/>
            </div>

        </div>
    )
}