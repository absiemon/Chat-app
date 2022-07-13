import React, { useState, useEffect, useRef} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from "styled-components";
import axios from 'axios';
import Contacts from '../components/Contacts';
import { allUserRoute, host } from '../utills/APIRoutes';

import { io} from "socket.io-client";

function Chat() {
  
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  // getting the current user
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // if user is not logged in  send him to login
    if (!localStorage.getItem("chat-app-user")) {
      navigate('/login');

    }
    else {
      //else set the currentUser state from the localStorage 
      async function setUser() {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      } 
      setUser();
    }
  }, [])

  //socket section
  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);  // whenever the current user is logged in we add it to the globle map
    }
  }, [currentUser])

  useEffect(() => {

    if (currentUser) {
      if(currentUser.isAvatarImageSet){
        async function fetchuser(){
          setContacts((await axios.get(`${allUserRoute}/${currentUser._id}`)).data );
        }
        fetchuser();
      }
      else{
        navigate('/setAvatar')
      }
    }
  }, [currentUser]);

  const hadleChatChange=(chat) => {
    // if we have any chat then set current chat 
    setCurrentChat(chat);
  }

  const handleLogout = async () => {
    
    localStorage.clear();
    navigate('/login');
  }

  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Chat-App</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
            </ul>

            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* <Container > */}
        <div className="container">
          <Contacts contacts={contacts} currentUser={currentUser} changeChat = {hadleChatChange} currentChat={currentChat} isLoaded={isLoaded} socket={socket}/>

        </div>
        
      {/* </Container> */}

    </>
  )
}

export default Chat