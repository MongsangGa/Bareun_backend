const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const roomName = 'barun-test';
const maxRoomSize = 2;

io.on('connection', (socket) => {
    console.log('접속');

    socket.on('joinRoom', () => {
        const room = io.sockets.adapter.rooms.get(roomName) || new Set();

        if (room.size < maxRoomSize) {
            socket.join(roomName);
            socket.emit('roomJoined', roomName);
            console.log(`User joined room: ${roomName}`);
        } else {
            socket.emit('roomFull', roomName);
            console.log(`Room is full: ${roomName}`);
        }
    });

    socket.on('message', (message) => {
        socket.to(roomName).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
