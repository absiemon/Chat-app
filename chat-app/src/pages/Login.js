import React, {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { loginRoute } from '../utills/APIRoutes';


function Login() {

    const navigate = useNavigate();
    const [values, setValues] = useState({
        name:"",
        password:"",
    }) 
    const {name, password} = values;

    const toastOptions = {

        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"

    }
    //IF THE USER IS ALREADY LOGGED IN ITS CREDENTIALS WILL BE IN localStorage then nevigate the user to hame page and we want to run this only once when the component is loaded
    useEffect(()=>{

      if(localStorage.getItem('chat-app-user')){
        navigate('/');
      }
    }, [])

    const onSubmit = async (e)=>{
        e.preventDefault();
        // after just submission call the handleValidation and if this comes true means each field has been given correctly
        // call the API
        if(handleValidation()){
            //API call
            const {name, password } = values; 
            const {data} = await axios.post(loginRoute, {
                name, 
                password,
            });

            // data will have the response
            if(data.status === false){
                toast.error(data.msg, toastOptions);
            } 
            if(data.status === true){
                console.log(data.findUser);
                localStorage.setItem("chat-app-user", JSON.stringify(data.findUser));  // saving the user info into the local storage
                navigate("/");

            }
        }
    }
    
    const handleValidation = ()=>{
        const {name,  password } = values;
        
        if(name.length ===""){
            toast.error("name is required", toastOptions);
            return false;
        }
       
        else if(password === ""){
            toast.error("password is required", toastOptions);
            return false;
        }
        return true;
    }

    const onChange =(e)=>{
        setValues({...values, [e.target.name]: e.target.value})

    }

    return (
        <div className="container my-4">
            <h1> Login Ther User</h1>
            <form onSubmit={onSubmit}>
                
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                    <input type="text" className="form-control" name="name" id="exampleInputEmail1" aria-describedby="emailHelp" value={name} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="exampleInputPassword1" value={password} onChange={onChange} />
                </div>
                
                {/* For error */}
                <button type="submit" className="btn btn-primary" > Login </button>
                <p className="my-3">Don't have an account? <Link to="/register">Register New User</Link></p>

            </form>
            <ToastContainer/>
        </div>)
}

export default Login