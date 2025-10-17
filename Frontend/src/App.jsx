import { useState, useEffect } from 'react'
import './App.css'
import Login from './Components/Login.jsx'
import SignUp from './Components/Signup.jsx'
import Home from './Components/Home.jsx'
import { ToastContainer} from 'react-toastify';
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


function App() {
  
  const router = createBrowserRouter(
  [
    {
      path: "/home",
      element: <Home />
    },
    {
     path: "/",
      element: <Login/> 
    },
    {
     path: "/signUp",
      element: <SignUp /> 
    }
  ]
)

  return (
    <>
      <RouterProvider router =  {router} />
      <ToastContainer />
     </>
  )
}

export default App
