// src/MainChatApp.jsx (Create this new file)

import React, { useState } from 'react';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from './MyContext.jsx';
import {v1 as uuidv1} from "uuid";
import './App.css'; 

function MainChatApp() {
  // Retain all your original state management here
  const[prompt, setPrompt] = useState("");
  const[reply, setReply] = useState(null);
  const[currThreadId, setCurrThreadId] = useState(uuidv1());
  const[prevChats, setPrevChats] = useState([]);
  const[newChat, setNewChat] =useState(true);
  const[allThreads, setAllThreads] = useState([]);


  const providerValues ={
    prompt,setPrompt,
    reply,setReply,
    currThreadId, setCurrThreadId,
    newChat,setNewChat,
    prevChats,setPrevChats,
    allThreads,setAllThreads
  };

  return (
    <div className='app'>
      <MyContext.Provider value = {providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
     </MyContext.Provider>
    </div>
  )
}

export default MainChatApp;