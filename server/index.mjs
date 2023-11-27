
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});
console.log(process.env.OPENAI_API_KEY);


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const openAIApiKey = process.env.API_KEY || process.env.OPENAI_API_KEY;


const openai = new OpenAI({ apiKey: openAIApiKey });

app.use(cors());

io.on("connection", (socket) => {
    socket.removeAllListeners();
    console.log(`User Connected: ${socket.id}`);
    

    socket.on("join_room", async (data) => {
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
    
        const response = await aiChat(data.ai_info, null)
        socket.emit(`receive_message_${data.room}`, response);
    });


    socket.on("generate_characters", async (data) => {
        console.log(data)
        const response = await aiCharacterGenerater(data)
        socket.emit("return_characters", response)
    })

    socket.on("send_message", async (data) => {
        console.log(data)
        const newMessages = data[0].map((message) => {
            if(message.author !== data[1].ai_name){
                return {
                    role: "user",
                    content: message.message
                }
            } else {
                return {
                    role: "assistant",
                    content: message.message
                }
            }
        })
        console.log(newMessages)
        const response = await aiChat(data[1], newMessages);
        socket.emit(`receive_message_${data[0][0].room}`, response);
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
        const logEntry = [
            {role: "system", content: `You're name ${ai_info.ai_name} is are a helpful ${ai_info.ai_role}`},
            {role: "system", content: `You're background is ${ai_info.ai_background}`},
        ]
        newMessage.forEach((mess) => {
            logEntry.push(mess)
        });
        const completion = await openai.chat.completions.create({
            messages: logEntry,
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


async function aiCharacterGenerater(data) {
    
    const logEntry = [
        {role: "system", content: `You are a helpful assistant to creating characters in a custom world and setting that the user will give you.`},
        {role: "system", content: `can you return each character that you create in an array of objects with each object having a name, role, and background information.`},
        {role: "user", content: `Can you create me ${data.number} of characters in the setting of ${data.setting}`}
    ]
    
    const completion = await openai.chat.completions.create({
        messages: logEntry,
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
    return completion.choices[0] 
    
}