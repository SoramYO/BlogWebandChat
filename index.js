var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var session = require('express-session');
var socketio = require('socket.io');
var app = express();
var controllers = require(__dirname + '/apps/controllers');

// Set the view engine and views directory
app.set('views', __dirname + '/apps/views');
app.set('view engine', 'ejs');

// Use body-parser middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', true);
app.use(session({
    secret: config.get('session.secret'),
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        //maxAge: 1000 * 60 * 60 * 24
    }
}));

// Static folder
app.use('/static', express.static(__dirname + '/public'));

// Use the controllers
app.use(controllers);

// Read host and port from the configuration and start the server
var host = config.get('server.host');
var port = config.get('server.port');
var server = app.listen(port, host, function () {
    console.log('Server is running on port', port);
});

var io = socketio(server);

var socketcontrol = require(__dirname + '/apps/common/socketcontrol');
socketcontrol(io);
