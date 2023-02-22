const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const {createServer} = require("http");

const app = express();

app.use(cors())

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

const server = app.listen(5000,()=>{
    console.log(`Server is listening at 5000`);
})
var connection = 0;

const io = socket(server);

io.on("connection",(socket)=>{
    console.log("Connection made with " + socket.id);

    io.emit('client connection',++connection);

    socket.on("typing",(data)=>{
        socket.to(data.room).emit('typing',data.username);
    });

    socket.on('sendMsg',(data)=>{
        const {message,sender,time} = data;
		console.log(data);
        io.to(data.room).emit('sendMsg',data);
    });

    socket.on('typingDone',(data)=>{
        socket.to(data.room).emit('typingDone');
    });
	
	socket.on('connectToRoom',(data)=>{
		socket.join(data.room);
		console.log("joined the room");
	});
});


io.on("disconnect",(socket)=>{
    console.log(socket.id + " disconnected");
    connection--;
})