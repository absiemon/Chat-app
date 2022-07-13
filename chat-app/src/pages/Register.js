import React, {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { registerRoute } from '../utills/APIRoutes';


function Register() {

    const navigate = useNavigate();
    const [values, setValues] = useState({
        name:"",
        email: "",
        password:"",
        confirmPassword: "",
    }) 
    const {name, email, password, confirmPassword} = values;

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
            const {name, email , password } = values; 
            const {data} = await axios.post(registerRoute, {
                name, 
                email,
                password,
            });

            // data will have the response
            if(data.status === false){
                toast.error(data.msg, toastOptions);
            } 
            
            if(data.status === true){
                console.log(data);
                localStorage.setItem("chat-app-user", JSON.stringify(data.findUser));  // saving the user info into the local storage
                navigate("/");

            }
        }
    }
    
    const handleValidation = ()=>{
        const {name, email, password, confirmPassword } = values;
        
        if(name.length <3){
            toast.error("name should be at least 3 characters", toastOptions);
            return false;
        }
        
        else if(password !== confirmPassword){
            toast.error("password and confirm password should be same", toastOptions);
            return false;
        }
        else if( password.length < 8){
            toast.error("password must be at least 8 characters", toastOptions);
            return false;
        }
        else if( email ===""){
            toast.error("email is required", toastOptions);
            return false;
        }
        return true;
    }

    const onChange =(e)=>{
        setValues({...values, [e.target.name]: e.target.value})

    }

    return (
        <div className="container my-4">
            <h1> Register Ther User</h1>
            <form onSubmit={ (e) => onSubmit(e)}>
                
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                    <input type="text" className="form-control" name="name" id="exampleInputName" aria-describedby="emailHelp" value={name} onChange={onChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="exampleInputPassword1" value={password} onChange={onChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name="confirmPassword" id="exampleInputConfirmPassword1" value={confirmPassword} onChange={onChange} />
                </div>
                
                {/* For error */}
                <button type="submit" className="btn btn-primary" > Register </button>
                <p className="my-3">Already have an account? <Link to="/login">Login</Link></p>

            </form>
            <ToastContainer/>
        </div>)
}

export default Register