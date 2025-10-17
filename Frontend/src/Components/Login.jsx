import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-toastify';

 export default function Login(){
   
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  function handlesubmit(e){
    e.preventDefault();
      const res = axios.post('/chatApp/api/v1/user/login', { email, password }, { withCredentials: true })
      .then((res) =>{
        toast.success(res.data.message.toUpperCase())
        navigate('/home')
      })
      .catch((err) =>{
        const message = err?.response?.status
        if(message === 401){
          toast.error("Password is incorrect")
        }else{
          toast.error("User Not Found")
          navigate('/signUp')
        }
      })
  }
  
  return(
    <div>
      <form onSubmit={handlesubmit}>
        <input type="email" name="email" placeholder="Enter your email"
        value = {email} onChange = {(e) => setEmail(e.target.value)} required ></input>
        <input type="password" name="password" placeholder = "Enter you password" value = {password} onChange = {(e) => setPassword(e.target.value)} required></input>
        <button type="submit">Login </button>
      </form>
      <Link to="/signUp">Not a already a user</Link>
    </div>
    )
}