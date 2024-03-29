const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const public_dir_path = path.join(__dirname, '../public');

app.use('/', express.static(public_dir_path));

io.on('connection', socket => {
    console.log('New WebSocket connection');

    socket.on('join', (options, callback) => {
        socket.join(options.room);

        callback();
    });

    socket.emit('message', generateMessage({username: 'Admin',text: 'Welcome!'}))

    socket.on('sendMessage', function(options, callback){
        io.to(options.room).emit('message', generateMessage({
            username: socket.id,
            text: options.text
        }))
        callback()
    });

    io.on('disconnection', socket => {
        console.log(socket.id + ' left the chat');
    });
});

/**
 * Start a connection with a websocket
 *
 * @param {Object} data - Data used to populate the message
 */
var generateMessage = function(data) {
    return {
        username: data.username,
        text: data.text,
        createdAt: new Date().getTime()
    }
}

server.listen(port);