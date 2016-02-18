var PORT = process.env.PORT || 3000;
var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
app.use(express.static(__dirname + '/public'));

var clientInfo = {};  // This is used to keep track of all the sockets wrt the room they belong to

io.on('connection', function (socket){
	console.log('User connected via socket.io');

	socket.on('disconnect', function (){
		var clientData = clientInfo[socket.id];
		if (typeof clientData !== 'undefined'){
			socket.leave(clientData.room);
			io.to(clientData.room).emit('message',{
				name: 'System',
				text : clientData.name + ' has left the room'
			});
			delete clientInfo[socket.id];
		}
	});


	socket.on('joinRoom', function (req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message',{
			name: 'System',
			text: req.name +'has joined the room',
			timestamp: moment().valueOf()
		});
	});


	socket.on('message', function (message){
		console.log('Message received: ' + message.text);
		message.timestamp = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message',message);
	});

	socket.emit('message',{
		name: 'System',
		text: 'Hi there! Welcome to the chat app',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT,function (){
	console.log('The server has started');
});
