import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { AuthContext } from "./AuthContext.jsx"; // <<< IMPORT AuthContext
import { useContext ,useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom"; // <<< IMPORT useNavigate

function ChatWindow(){
  const{ prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats,setNewChat} = useContext(MyContext);
  // Get logout function from AuthContext
  const { logout } = useContext(AuthContext); // <<< USE AuthContext
  const navigate = useNavigate(); // <<< USE useNavigate
  const[loading, setLoading] = useState(false);
  const[isOpen, setIsOpen] = useState(false); 

  const getReply = async () => {
    // ... (Your existing getReply function remains unchanged)
    setLoading(true);
    setNewChat(false);
    console.log("message", prompt, "threadId", currThreadId)
    const options = {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId
      })
    };

    try{
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply); 
    } catch(err){
      console.log(err);
    }
    setLoading(false);
  }


  //append new chat to prevCHats
  useEffect(() =>{
   if(prompt && reply){
    setPrevChats(prevChats => (
      [...prevChats,{
         role: "user",
         content: prompt
      },{
        role:"assistant",
        content: reply
      }
      ]
    ));
   }
   setPrompt("");
  }, [reply]);


  const handleProfileClick =() =>{
    setIsOpen(!isOpen);
  }

  // ----------------------------------------------------
  // --- NEW HANDLERS FOR DROPDOWN FUNCTIONALITY ---
  // ----------------------------------------------------
  const handleLogout = () => {
      logout(); // Clear session state and storage
      navigate('/login'); // Redirect to login page
      setIsOpen(false); // Close the dropdown menu
  };

  const handleSettings = () => {
      navigate('/settings'); // Navigate to the Settings route
      setIsOpen(false);
  };

  const handleUpgrade = () => {
      navigate('/upgrade'); // Navigate to the Upgrade Plan route
      setIsOpen(false);
  };
  // ----------------------------------------------------
  
    return(
        <div className="chatWindow">
            <div className="navbar">
              <span ><h3>HeritageAI<i class="fa-solid fa-caret-down"></i></h3> </span>
              <div className="userIconDiv" onClick={handleProfileClick}>
                <span className="userIcon"><i className="fa-solid fa-user"></i></span>
              </div> 
            </div>
            {
              isOpen && 
              <div className="dropDown">
                
                {/* SETTINGS ITEM: Use handleSettings */}
                <div className="dropDownItem" onClick={handleSettings}>
                    <i class="fa-solid fa-gear"></i>Settings
                </div>
                
                {/* UPGRADE ITEM: Use handleUpgrade */}
                <div className="dropDownItem" onClick={handleUpgrade}>
                    <i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
                </div>
                
                {/* LOGOUT ITEM: Use handleLogout */}
                <div className="dropDownItem" onClick={handleLogout}>
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>Logout
                </div>
                </div>
            }
            <Chat></Chat>
            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>
            <div className="chatInput">
               <div className="inputBox">
                 <input placeholder="Ask anything" 
                  value ={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' ? getReply() :' '}>  
                  
                   </input> 
                  <div id="submit" onClick={getReply}><i className= "fa-solid fa-paper-plane"></i></div>
               </div>
               <p className="info">
                  Heritage AI can make mistakes. Check important info. See Cookie preferences.
               </p>
            </div>
        </div>
    )
}

export default ChatWindow;