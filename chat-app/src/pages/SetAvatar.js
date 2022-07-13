import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utills/APIRoutes";
import loading from "../assets/loading.gif";

function SetAvatar() {

    const navigate = useNavigate();

    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const avatars = [
        {
            key: 1,
            avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWVufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
        },
        {
            key: 2,
            avatarImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YW1lcmljYW4lMjBnaXJsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
        },
        {
            key: 3,
            avatarImage: "https://images.unsplash.com/photo-1608649672519-e8797a9560cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fG9sZCUyMG1hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60"
        },

    ];

    useEffect( () => {

        if (!localStorage.getItem('chat-app-user'))
          navigate("/login");
    }, []);


    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        }
        else {
            setIsLoading(true);
            const user = await JSON.parse(localStorage.getItem('chat-app-user'));
            // send the avatar images to the sever to set as profile pic
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
            
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem( 'chat-app-user', JSON.stringify(user));
                setIsLoading(false);
                navigate("/");
            }
             else {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        }

    }
    return (
        <>
        { isLoading ? <Container> <img src ={loading} alt="loading" className="loader"/></Container>
            : 
            <Container>
                <div className="title-container">
                    <h1>Pick an Avatar as your profile picture</h1>
                </div>
                <div className="avatars">
                    {avatars.map((avatar, index) => {
                        return (
                            <div
                                className={`avatar ${selectedAvatar === index ? "selected" : ""
                                    }`}
                                    >
                                <img
                                    src={avatar.avatarImage}
                                    alt="avatar"
                                    key={avatar.key}
                                    onClick={() => setSelectedAvatar(index)}
                                />
                            </div>
                        );
                    })}
                </div>

                <button onClick={setProfilePicture} className="btn btn-primary">
                    Set as Profile Picture
                </button>

            </Container>
        }
        <ToastContainer />
        </>
    )
}

const Container = styled.div`
display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  height: 100vh;
  width: 100vw;
 
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        border-radius: 1rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  
  `;

export default SetAvatar