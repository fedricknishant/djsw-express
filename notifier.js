// notifier.js

var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
          },
        
    }),
    bodyParser = require('body-parser');


// Accept URL-encoded body in POST request.
app.use(bodyParser.urlencoded({ extended: true }));

// Echo the client's ID back to them when they connect.
io.on('connection', function(client) {
	client.emit('register', client.id);

    // join the user id room
    client.on('join', function (room) {
        client.join(room);
    });
});

app.get('/', function(request, response) {
    response.send('Home.');
});

// Forward task results to the clients who initiated them.
app.post('/notify', function(request, response) {
    io.to(request.body.clientid).emit('update', `${request.body.result}-${request.body.clientid}`);
	response.type('text/plain');
    response.send('Result broadcast to client.');
});


server.listen(3000);
console.log("server listening on port 3000");