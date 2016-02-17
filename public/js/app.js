var socket = io();

socket.on('connect',function (){
	console.log('Connection made successfully to the server');
});

socket.on('message', function (message){
	console.log('New message');
	console.log(message.text);
})