import React, { useState } from 'react'
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import {IoMdSend} from "react-icons/io";

import { BsEmojiSmileFill } from "react-icons/bs";

function ChatInput(props) {

    const {handleSendMsg} = props;
    // state for emoji picker hide and show
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    // sate for setting the message
    const [msg, setMsg] = useState("");

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }

    // function for clicking emoji
    const handleEmojiClick = (event, emojiObject)=>{
        let message  = msg;
        message += emojiObject.emoji;  // concat the emoji with the emojiObject
        setMsg(message);
    }

    // function for sending chat
    const sendChat = (event)=>{
        event.preventDefault();
        if(msg.length >0){

            // send the msg
            handleSendMsg(msg);
            setMsg("");
        }
    }
    return (
        <Container>
            
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}  className="smileEmoji"/>
                    {
                        // if the emoji picker is shown then  
                        showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>
                    }
                </div>
            </div>
            <form className="input-container" onSubmit={(e)=> sendChat(e)}>
                <div className="form-group input ">
                    <input type="text" className="form-control" onChange = {(e)=> setMsg(e.target.value)}  value = {msg}  aria-describedby="emailHelp" placeholder="Enter message"/>
                    <button className="btn btn-primary mx-1">
                        <IoMdSend/>
                    </button>
                </div>        
            </form>
        </Container>
    )
}

const Container = styled.div`
display: flex;
gap:0.5rem;
padding-left: 0.3rem;
.form-control{
    width: 40rem;
    height: 3rem;
    margin-top: -9px;
}


.emoji-picker-react{
    position: absolute;
    top: 14rem;
}
.smileEmoji{
    margin-top: 10px;
    cursor: pointer;
}
.input{
    display: flex;
    @media screen and (max-width: 1200px){
        width: 36rem;
    }
}
`;
export default ChatInput