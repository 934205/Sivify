import { useState } from 'react'
import './App.css'
import background from './assets/login-background.webp'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Layout from './components/Layout'
import Home from './components/Home'
import Search from './components/Search'
import Message from './components/Message'
import Notification from './components/Notification'
import Post from './components/Post'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import SetProfile from './components/SetProfile'
import SingleUser from './components/DisplaySingleUser'
function App() {
  

  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/set_profile' element={<SetProfile/>}/>
          <Route path='/edit_profile' element={<EditProfile/>} />
          
          
          <Route element={<Layout/>}>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/message" element={<Message />} />
            <Route path="/notification" element={<Notification/>} />
            <Route path="/post" element={<Post />} />
            <Route path="/profile" element={<Profile />} />
            <Route path='/single_user_details/:user_id' element={<SingleUser/>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
