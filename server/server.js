var http = require('http');
var express = require('express');
var IO = require('socket.io');

var app = express();
var server = http.createServer(app);
app.use(express.static('../dist'));
server.listen(8011, function() {
	console.log('server started! port 8011');
});

var io = IO(server);

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
	socket.on('check login', function (data) {
		console.log(data.username);
		console.log(data.password);
		socket.emit('login', new Date());
	})
});