 var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

socket.on('connect',function (){
	console.log('Connection made successfully to the server');
	socket.emit('joinRoom',{
		name: name,
		room: room
	});
});

jQuery('.room-title').text(room);

socket.on('message', function (message){

	var momentTimeStamp = moment.utc(message.timestamp);
	console.log('New message');
	console.log(message.text);
	console.log(momentTimeStamp.format('h:mm a'));
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');
	$message.append('<p> <strong>' + message.name + '</strong></p>');
	$message.append('<p> <strong>' + momentTimeStamp.local().format('h:mm a')+ ': </strong>' + message.text + '</p>');
	$messages.append($message);
});


//Handles submitting of new message

var $form = jQuery('#message-form');

$form.on('submit',function  (event) {
	event.preventDefault();
	var $message = $form.find('input[name=message]');
	socket.emit('message',{
		name: name,
		text: $message.val()
	})	
	$message.val('');
});