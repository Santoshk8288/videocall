var socket = io.connect('192.168.88.73:3000')
var user = {}, caller={}, calling_to = {}, audio, canvas, context, selfvideo,othervideo

var constraints = {
  video: true,
  audio: true
};


selfvideo = document.getElementById("selfvideo")
othervideo = document.getElementById("othervideo")

$('#join').show()
$('#users').hide()
$('#game-board').hide()

function start(){
	name = $('#name').val()
	$('#join').hide()
	$('#users').show()
	socket.emit('add user', name)
}

function call(data){
	calling_to = data
	$('#users').hide()
	$('#calling').show()
	$('#beingcalled').html(name)
	socket.emit('call', {to : data.id, from : user.id })
}

function logger(msg){
	$("#logger").text(msg)
}

function loadCam(stream){
	selfvideo.srcObject = stream;
	setInterval(function(){
		socket.emit('stream', JSON.stringify(stream))
	},70)
	logger('camara [ok]')
}

function loadFail(){
	logger('camara not working')
}

function answer(){
	socket.emit('ready to answer', caller)
	$('#incommingcall').hide();
	$('#calling').hide();
	$('#calling-page').show();
	$(function(){
		navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia);
		navigator.getUserMedia(constraints, loadCam, loadFail)
	})
}

socket.on('self info', function(u){
	user.name = u.name
	user.id = u.id
})

socket.on('ringing', function(data){
	$('#users').hide()
	$('#incommingcall').show()
	caller = data;
	$('#caller').html(caller.name)
})

socket.on('start talking', function(){
	$('#incommingcall').hide();
	$('#calling').hide();
	$('#calling-page').show();
	$(function(){
		navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia);
		navigator.getUserMedia(constraints, loadCam, loadFail)
	})
})

socket.on('available users', function(users){

	$('#users-list').empty()
	for(var i=0; i<=users.length-1; i++){
		if(name != users[i].name){
			$('ul').append("<li>"+users[i].name +"<button onclick=call("+JSON.stringify(users[i])+")>call</button></li>")
		}
	}
})

function loadCam1(stream){
	logger('camara [ok]')
}

function loadFail1(){
	logger('camara not working')
}
socket.on('stream1', function(stream){
	othervideo.srcObject = stream
	console.log(stream)
	$('#logger').text(stream)
})
