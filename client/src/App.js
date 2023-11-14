import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  
  const [AIName, setAIName] = useState("");
  const [AIBackground, setAIBackground] = useState("");
  const [AIRole, setAIRole] = useState("");

  

  const joinRoom = () => {
    if (username !== "" && room !== "" && AIName !== "" && AIBackground !== "" && AIRole !== "") {
      const data = {
        room: room,
        ai_info: {
          ai_name: AIName,
          ai_role: AIRole,
          ai_background: AIBackground
        },
        
      }
      socket.emit("join_room", data);
      setShowChat(true);
    }
  };


  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input type="text" placeholder="Enter Name" onChange={(event) => {setUsername(event.target.value);}} />
          <input type="text" placeholder="Enter Room ID" onChange={(event) => {setRoom(event.target.value);}} />
          <input type="text" placeholder="Enter AI Name" onChange={(event) => {setAIName(event.target.value);}} />
          <input type="text" placeholder="Enter AI Role" onChange={(event) => {setAIRole(event.target.value);}} />
          <input type="text" placeholder="Enter AI Background" onChange={(event) => {setAIBackground(event.target.value);}} />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} AIName={AIName} AIBackground={AIBackground} AIRole={AIRole}  />
      )}
    </div>
  );
}

export default App;
