var socket = io();

socket.on('connect',function (){
	console.log('Connection made successfully to the server');
});