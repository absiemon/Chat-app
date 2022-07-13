// we will be fetching all the contacts from the database and showing
import React, { useState, useEffect, useRef } from 'react'
import styled from "styled-components";
import Welcome from './Welcome';
import ChatInput from './ChatInput';
import axios from 'axios';
import { sendMessageRoute, getAllMessagesRoute } from '../utills/APIRoutes';
import { v4 as uuidv4 } from "uuid";

function Contacts(props) {
    const { contacts, currentUser, changeChat, currentChat, isLoaded, socket } = props;

    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage);

            setCurrentUserImage(currentUser.name);
        }
    }, [currentUser])

    const changeCurrentChat = (contact, index) => {
        setCurrentSelected(index);
        changeChat(contact);
    }

    //-------CHAT-SECTION WORK---------

    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    // we will call the api to get all message of the currentChat. and whenver the currentChat is changing we will call the api
    useEffect(() => {

        if (currentChat !== undefined) {

            const fetchMsg = async () => {
                const response = await axios.post(getAllMessagesRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                })
                console.log(response);
                setMessages(response.data);
                console.log(messages);


            }
            fetchMsg();
        }

    }, [currentChat]);


    const handleSendMsg = async (msg) => {
        // whenever we send the msg we will store in the backend;
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg
        });
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg })
        setMessages(msgs);

    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                console.log({msg})
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);

    // whenever any arrivalMessage is there we're gonna copy the arrival message to prev
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
    }, [messages]);

    return (
        <>
            <Container>
            
                <div className=" container main">
                    
                    <div className="contact-section">
                            
                        <div className="card" style={{ marginLeft: '-11px' }}>
                            
                            <ul className="list-group list-group-flush">
                                {contacts.map((contact, index) => {
                                    return (

                                        <li className="list-group-item d-flex contact" onClick={() => changeCurrentChat(contact, index)}>
                                            <img src={contact.avatarImage} alt="img" className="rounded-circle mr-1" width="60" height="60" />
                                            <div className="flex-grow-1 ml-3 mx-3">
                                                {contact.name}
                                                <div className="small"><span className="fas fa-circle chat-online"></span> Online</div>
                                            </div>
                                        </li>
                                    )
                                })
                                }

                            </ul>
                        </div>

                    </div>

                    <div className="chat-container">
                        {isLoaded && currentChat === undefined ?

                            <Welcome currentUser={currentUser} />
                            :
                                    // <ChatContainer3 currentChat={currentChat} currentUser = {currentUser} isLoaded={isLoaded} currentSelected={currentSelected} socket={socket}/>
                            <>
                                { currentChat &&

                                <div className="chat-header">
                                    <img src={currentChat.avatarImage} alt="img" className="rounded-circle mr-1 mx-2 my-2" width="40" height="40"/>
                                    <div className="flex-grow-1 ml-3 my-3">
                                        <h5>{currentChat.name}</h5>
                                    </div>
                                 </div>

                                }
                                <div className="chat-section">
                                {currentChat && messages.map((message) => {
                                        return (
                                            <>
                                                {message.fromSelf ?
                                                    <div className="chat-message-right pb-4" ref={scrollRef} key={uuidv4()}>
                                                        <div>
                                                            <img src={currentUser.avatarImage} className="rounded-circle mr-1" alt="Img" width="40" height="40" />
                                                            <div className="text-muted small text-nowrap mt-2">2:33 am</div>
                                                        </div>
                                                        <div className="flex-shrink-1 rounded py-2 px-3 mr-3" style={{background: '#b1d7fe'}}>
                                                            <div className="font-weight-bold mb-1">You</div>
                                                            {message.message}
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="chat-message-left pb-4" ref={scrollRef} key={uuidv4()}>
                                                        <div>
                                                            <img src={currentChat.avatarImage} className="rounded-circle mr-1" alt="Img" width="40" height="40" />
                                                            <div className="text-muted small text-nowrap mt-2">2:34 am</div>
                                                        </div>
                                                        <div className="flex-shrink-1 rounded py-2 px-3 ml-3" style={{background: '#b1d7fe'}}>
                                                            <div className="font-weight-bold mb-1">{currentChat.name}</div>
                                                            {message.message}
                                                        </div>
                                                    </div>
                                                }

                                            </>
                                        );

                                    })

                                    }
                                </div>

                                <div className=" chat-input">
                                    <ChatInput handleSendMsg={handleSendMsg}/>
                                </div>
                            </>
                        }
                    </div>

                </div>

            </Container>
        </>
    )
}


const Container = styled.div`
.main{

    width: 100%;
    height: 85vh;
    margin-top: 2rem;
    display: flex;
    margin-top: 5rem;
}

.user{
    postion: relative;
}
.contact-section{
    width: 30%;
    border-right: 1px solid black;
    overflow: scroll;
    overflow-x:hidden;
    border: 1px solid #c1b7b7;

    
    ::-webkit-scrollbar {
        width: 4px;
      }
        ::-webkit-scrollbar-track {
        background: #f1f1f1; 
      }
        ::-webkit-scrollbar-thumb {
           background: #888; 
          border-radius:10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        
        background: #007bff;

      } 
}
.contact:hover{
    cursor: pointer;
    background-color: #e7e7e7
}
.chat-container{
    width: 70%;
    border: 1px solid #c1b7b7;
    display: flex;
    flex-direction: column;
    
}
.chat-header{
    width: 100%;
    height:10% ;
    border-bottom: 1px solid black;
    display:flex;
    background-color: #e7e7e7;

}

.chat-section{
    width:100% ;
    height: 80%;
    overflow: scroll;
    overflow-x:hidden;
    padding: 7px;
    ::-webkit-scrollbar {
        width: 4px;
      }
        ::-webkit-scrollbar-track {
        background: #f1f1f1; 
      }
        ::-webkit-scrollbar-thumb {
           background: #888; 
          border-radius:10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        
        background: #007bff;

      } 
}
.chat-input{
    height: 10%;
    border-top: 1px solid #cfbcbc;
    padding-top: 14px;
    padding-left: 1rem;
    background-color: #e7e7e7;

}

.chat-message-left,
.chat-message-right {
    display: flex;
    flex-shrink: 0
}

.chat-message-left {
    margin-right: auto
}

.chat-message-right {
    flex-direction: row-reverse;
    margin-left: auto
}
.py-3 {
    padding-top: 1rem!important;
    padding-bottom: 1rem!important;
}
.px-4 {
    padding-right: 1.5rem!important;
    padding-left: 1.5rem!important;
}
.flex-grow-0 {
    flex-grow: 0!important;
}
.border-top {
    border-top: 1px solid #dee2e6!important;
}

`;

export default Contacts