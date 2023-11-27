// import "./App.css";
// import io from "socket.io-client";
// import { useState } from "react";
// import Chat from "./Chat";

// const socket = io.connect("http://localhost:3001");

// function App() {
//   const [username, setUsername] = useState("");
//   const [showChat, setShowChat] = useState(false);
  
//   const [numberOfCharacters, setNumberOfCharacters] = useState("");
//   const [setting, setSetting] = useState("")
//   const [characterList, setCharacterList] = useState([])


//   const handleGenerate = () => {
//     const data = {
//       number: numberOfCharacters,
//       setting: setting
//     }
//     console.log(data)
//     socket.emit("generate_characters", data)
//     socket.on("return_characters", handleCharacters)
//   }


//   const handleCharacters = (data) => {
//     const characterString = data.message.content;
//     const characters = characterString.split(/\d+\.\s+/).filter(Boolean);
  
//     const characterObjects = [];
  
//     for (let i = 1; i < characters.length; i++) {
//       const character = characters[i];
//       const lines = character.split('\n').filter(Boolean);
  
//       if (lines.length >= 3) {
//         const name = lines[0].split(':')[1].trim();
//         const role = lines[1].split(':')[1].trim();
//         const background = lines[2].split(':')[1].trim();
  
//         const characterObject = {
//           name: name,
//           role: role,
//           background: background,
//         };
  
//         characterObjects.push(characterObject);
//       }
//     }
  
//     setCharacterList(characterObjects);
//     setShowChat(!showChat);
//   };


//   const chatRooms = () => {
//     console.log(characterList)
//     const rooms = characterList.map((character) => {

//       const data = {
//         room: character.name,
//         ai_info: {
//           ai_name: character.name,
//           ai_role: character.role,
//           ai_background: character.background,
//         },
//       }

//       console.log(data.room)
//       socket.emit("join_room", data);

//       return (
//         <div style={{marginTop: "100px"}}>
//           <Chat socket={socket} username={username} room={character.name} AIName={character.name} AIBackground={character.background} AIRole={character.role}  />
//         </div>)
//     })

//     return rooms
//   }



//   return (
//     <div className="App">
//       {!showChat ? (
//         <>
//         <div className="joinChatContainer">
//           <h3>Generate characters</h3>
//           <input type="text" placeholder="Enter Your Name" onChange={(event) => {setUsername(event.target.value);}} />
//           <input type="text" placeholder="Number of characters" onChange={(event) => {setNumberOfCharacters(event.target.value);}} />
//           <input type="text" placeholder="Enter setting information" onChange={(event) => {setSetting(event.target.value);}} />
//           <p>The more information you provide in the setting input will only give the ai more information to create these characters.</p>
//           <button onClick={handleGenerate}>Generate</button>
//         </div>
//         </>
//       ) : (
//         chatRooms()
//       )}
//     </div>
//   );
// }

// export default App;

// App.js
import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");
function App() {
  const [username, setUsername] = useState("");
  const [showGenerateForm, setShowGenerateForm] = useState(true);
  const [characterList, setCharacterList] = useState([]);
   const [setting, setSetting] = useState("")
  const [numberOfCharacters, setNumberOfCharacters] = useState("");


  useEffect(() => {
    const handleCharacters = (data) => {
      const characterString = data.message.content;
      const characters = characterString.split(/\d+\.\s+/).filter(Boolean);

      const characterObjects = [];

      for (let i = 1; i < characters.length; i++) {
        const character = characters[i];
        const lines = character.split('\n').filter(Boolean);

        if (lines.length >= 3) {
          const name = lines[0].split(':')[1].trim();
          const role = lines[1].split(':')[1].trim();
          const background = lines[2].split(':')[1].trim();

          const characterObject = {
            name: name,
            role: role,
            background: background,
          };

          characterObjects.push(characterObject);
        }
      }

      setCharacterList(characterObjects);
      setShowGenerateForm(false); // Update state to switch to chat room display
    };

    socket.on("return_characters", handleCharacters);

    return () => {
      socket.off("return_characters", handleCharacters);
    };
  }, []); // No need to include showGenerateForm in the dependency array

  const handleGenerate = () => {
    const data = {
      number: numberOfCharacters,
      setting: setting,
    };
    console.log(data);
    socket.emit("generate_characters", data);
  };

  const chatRooms = () => {
    return characterList.map((character) => (
      
      <div key={character.name} style={{ marginTop: "100px" }}>
        <Chat
          socket={socket}
          username={username}
          room={character.name}
          AIName={character.name}
          AIBackground={character.background}
          AIRole={character.role}
        />
      </div>
    ));
  };

  return (
    <div className="App">
      {showGenerateForm ? (
        <>
          <div className="joinChatContainer">
            <h3>Generate characters</h3>
            <input
              type="text"
              placeholder="Enter Your Name"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Number of characters"
              onChange={(event) => {
                setNumberOfCharacters(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Enter setting information"
              onChange={(event) => {
                setSetting(event.target.value);
              }}
            />
            <p>
              The more information you provide in the setting input will only
              give the AI more information to create these characters.
            </p>
            <button onClick={handleGenerate}>Generate</button>
          </div>
        </>
      ) : (
        chatRooms()
      )}
    </div>
  );
}

export default App;