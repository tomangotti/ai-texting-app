import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room, AIName, AIBackground, AIRole }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
        const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };

        await socket.emit("send_message", [...messageList, messageData]);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
        }
    };

    useEffect(() => {
        const receiveMessageHandler = (data) => {
            const aiMessage = {
                room: room,
                author: AIName,
                message: data.message.content,
                time: new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
            }
            console.log(data)
            console.log(aiMessage)
            setMessageList((list) => [...list, aiMessage]);
        };
    
        socket.on("receive_message", receiveMessageHandler);
    
        return () => {
            socket.off("receive_message", receiveMessageHandler);
        };
    }, []);

    return (
        <div className="chat-window">
        <div className="chat-header">
            <p>Live Chat</p>
        </div>
        <div className="chat-body">
            <ScrollToBottom className="message-container">
            {messageList.map((messageContent, index) => {
                return (
                <div
                    className="message"
                    id={username === messageContent.author ? "you" : "other"}
                    key={index}
                >
                    <div>
                    <div className="message-content">
                        <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                        <p id="time">{messageContent.time}</p>
                        <p id="author">{messageContent.author}</p>
                    </div>
                    </div>
                </div>
                );
            })}
            </ScrollToBottom>
        </div>
        <div className="chat-footer">
            <input
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
                setCurrentMessage(event.target.value);
            }}
            onKeyDown={(event) => {
                event.key === "Enter" && sendMessage();
            }}
            />
            <button onClick={sendMessage}>&#9658;</button>
        </div>
        </div>
    );
}

export default Chat;