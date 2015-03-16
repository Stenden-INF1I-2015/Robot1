var express = require("express");
var app = express();
var wPort = 3700;
var sPort = 'COM5';

var SerialPort = require('serialport').SerialPort;
var readData;

app.get("/", function(req, res) {
	res.sendfile("./public/index.html");
});

var io = require("socket.io").listen(app.listen(wPort));
console.log("Listening on port " + wPort);

var sp = new SerialPort(sPort, {
	baudrate: 9600
});

io.sockets.on('connection', function(socket) {
	socket.emit('message', 'Hi there');

	socket.on('ping', function(data) {
		socket.emit('message', 'pong');
		console.log("Socket " + socket.id + " pinged the server.");
	});
});

sp.on('open', function() {
	console.log('Serial port opened');
	io.sockets.emit('message', 'Serial port opened');
	sp.on('data', function(data) {
		readData += data.toString();
		if (readData.indexOf('{') >= 0 && readData.indexOf('}') >= 0) {
			cleanData = "{" + readData.substring(readData.indexOf('{') + 1, readData.indexOf('}')) + "}";
		    readData = '';
		    io.sockets.emit('message', cleanData);
		}
	})
});

// var SerialPort  = require('serialport').SerialPort;
// var portName = 'COM3';

// var io = require('socket.io').listen(8000); // server listens for socket.io communication at port 8000
// io.set('log level', 1); // disables debugging. this is optional. you may remove it if desired.

// var sp = new SerialPort(); // instantiate the serial port.
// sp.open(portName, { // portName is instatiated to be COM3, replace as necessary
//    baudRate: 9600, // this is synced to what was set for the Arduino Code
//    dataBits: 8, // this is the default for Arduino serial communication
//    parity: 'none', // this is the default for Arduino serial communication
//    stopBits: 1, // this is the default for Arduino serial communication
//    flowControl: false // this is the default for Arduino serial communication
// });

// io.sockets.on('connection', function (socket) {
// 	// If socket.io receives message from the client browser then
//     // this call back will be executed.
//     socket.on('message', function (msg) {
//     	console.log(msg);
//     });
//     // If a web browser disconnects from Socket.IO then this callback is called.
//     socket.on('disconnect', function () {
//     	console.log('disconnected');
//     });
// });

// var cleanData = ''; // this stores the clean data
// var readData = '';  // this stores the buffer
// sp.on('data', function (data) { // call back when data is received
//     readData += data.toString(); // append data to buffer
//     // if the letters 'A' and 'B' are found on the buffer then isolate what's in the middle
//     // as clean data. Then clear the buffer.
//     if (readData.indexOf('B') >= 0 && readData.indexOf('A') >= 0) {
//         cleanData = readData.substring(readData.indexOf('A') + 1, readData.indexOf('B'));
//         readData = '';
//         io.sockets.emit('message', cleanData);
// 	}
// });
