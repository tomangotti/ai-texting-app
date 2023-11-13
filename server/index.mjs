// import OpenAI from "openai"
// import express from "express"

// const express = require("express");
// const app = express();
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");



// const openai = new OpenAI();


// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     },
// });



// io.on("connection", (socket) => {
//     socket.removeAllListeners() 
//     console.log(`User Connected: ${socket.id}`);

//     socket.on("join_room", (data) => {
//         socket.join(data);
//         console.log(`User with ID: ${socket.id} joined room: ${data}`);
//     });

//     socket.on("send_message", (data) => {
//         console.log(data)
//         socket.to(data.room).emit("receive_message", data);
//     });

//     socket.on("ai_chat_message", (data) => {
//         console.log(data)
        
//     })

//     socket.on("disconnect", () => {
//         console.log("User Disconnected", socket.id);
//     });
// });



// server.listen(3001, () => {
//     console.log("SERVER RUNNING");
// });

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import OpenAI from "openai";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const openai = new OpenAI({ apiKey: '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' });

app.use(cors());

io.on("connection", (socket) => {
    socket.removeAllListeners();
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", async (data) => {
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);

        const response = await aiChat(data.ai_info, null)
        socket.emit("receive_message", response);
    });

    socket.on("send_message", (data) => {
        
        const newMessage = {
            role: 'user',
            content: data.message
        }
        let n = data.length - 1
        // aiChat(newMessage);
        socket.to(data[n].room).emit("receive_message", data[n]);
    });

    socket.on("ai_chat_message", (data) => {
        console.log(data);
        
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
});



async function aiChat(ai_info, newMessage) {
    if (newMessage) {
        const completion = await openai.chat.completions.create({
            messages: [
                        {role: "system", content: `You're name ${ai_info.ai_name} is are a helpful ${ai_info.ai_role}`},
                        {role: "system", content: `You're background is ${ai_info.ai_background}`},
                        newMessage,
                    ],
            model: "gpt-3.5-turbo",
        });
    
        console.log(completion.choices[0]);
        return completion.choices[0]
    } else if (!newMessage) {
        const completion = await openai.chat.completions.create({
            messages: [
                        {role: "system", content: `You're name is ${ai_info.ai_name} and you are a helpful ${ai_info.ai_role}`},
                        {role: "system", content: `You're background is ${ai_info.ai_background}`},
                        {role: "system", content: `please introduce yourselve and answer any questions the user may have`}
                    ],
            model: "gpt-3.5-turbo",
        });
    
        console.log(completion.choices[0]);
        return completion.choices[0]
    }
    
}