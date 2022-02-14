const APP = require('./app');
const port = process.env.PORT || '8080';

const app=APP.app
const http=APP.http

//our server with the port it listens
const server = http.listen(port, () => {
	console.log("Listening to port " + port)
});

//const io = require('socket.io')(server);
//creating socket connection
const io=APP.io
io.on('connection', function(socket){
	
	console.log('A user connected');
	
	//Whenever someone disconnects this piece of code executed
	socket.on('disconnect', function () {
	   console.log('A user disconnected');
	});
 });

//testing coap
/*
const coap = require('coap')
const server1 = coap.createServer()

server1.on("request", function (req, res) {
	res.setOption("Content-Format", "text/plain");
	console.log(req.payload)
	console.log(req)
	console.log(new Buffer.from(req.payload).toString());

	if (req.url !== "/topic1") {
	  res.code = "4.04";
	  return res.end();
	} else if (req.method !== "GET") {
	  res.code = "4.05";
	  return res.end();
	}
  
	if (req.headers["Observe"] !== 0)
	  return res.end(
	 	"Hello thereUpdate on topic1. Timestamp: " + new Date().toISOString()
	  );
  
	var interval = setInterval(function () {
	  res.write("Hello there Update on topic1. Timestamp: " + new Date().toISOString());
	}, 1000);
  
	res.on("finish", function (err) {
	  clearInterval(interval);
	});
  });
  
  server1.listen(port,function () {
	console.log("server started "+port);
  });

//------------*/