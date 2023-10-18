var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000
var bodyParser    = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
app.get('/', function(req,res){
	res.redirect('index.js')
})
var USERS = {}, connectedUsers = []
io.on('connection', function(socket){
	socket.on('add user', function(user){
		socket.userId = parseInt(Math.random()*100)
		socket.name = user
		USERS[socket.userId] = socket
		var p = {
			name:socket.name,
			id:socket.userId
		}
		connectedUsers.push(p)
		socket.emit('self info', p)
		io.sockets.emit('available users',  connectedUsers)
		var room = io.sockets.adapter.rooms[socket.game];
	})

	socket.on('call', function(data){
		socket.to = data.to
		connectedUsers.forEach(function(user){
			if(user.id == data.from){
				USERS[data.to].emit('ringing', user)
			}
		})
	})

	socket.on('ready to answer', function(data){
		socket.to = data.id
		USERS[data.id].emit('start talking')
	})

	socket.on('stream', function(stream){
		console.log(socket.to+','+ stream)
		socket.broadcast.emit('stream1', stream)
	})
})

http.listen(port, function(){
	console.log('process running at %s', port)
})
