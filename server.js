const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let documentContent = "";  // Store the current document content

app.use(express.static('public'));

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current content to the newly connected user
    socket.emit('update-content', documentContent);

    // Listen for content changes from clients
    socket.on('content-change', (content) => {
        documentContent = content;  // Update the document content
        socket.broadcast.emit('update-content', documentContent);  // Broadcast updated content to others
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
