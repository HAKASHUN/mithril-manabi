var express = require('express');
var app = express();

app.use(express.static('client'));
app.use(express.static('node_modules'));


var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000);

var users = {};

io.sockets.on('connection', function(socket) {
    console.log('connection...');
    socket.on('login', function(userName) {

        console.log('logined...');

        if(users[userName]) {
            socket.emit('login result', false);
            return;
        }
        console.log(users);
        users[userName] = true;
        socket.emit('login result', true);

        io.emit('receive chat', {user: userName, text: 'login'});

        socket.on('disconnect', function() {
            delete users[userName];
            io.emit('receive chat', {user: userName, text: 'logout'});
        });

        socket.on('send chat', function(msg) {
            io.emit('receive chat', {user: userName, text: msg});
        });
    });
});