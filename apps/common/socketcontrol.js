module.exports = function (io) {
    var users = []; // Change from username to users for clarity
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('addUser', (username) => {
            socket.username = username;
            console.log('user ' + username + ' connected');
            users.push(username);

            // Notify the user who just connected
            let dataToUser = {
                sender: "Server",
                message: 'You have join to the chat room',
            };
            socket.emit('connected', dataToUser);

            // Notify all other users about the new user
            let dataToOthers = {
                sender: "Server",
                message: username + ' has connected to the chat room',
            };
            socket.broadcast.emit('update_mess', dataToOthers);
        });

        socket.on('chat message', (msg) => {
            var data = {
                sender: socket.username,
                message: msg,
            };
            socket.emit('chat message', data);

            var dataToOthers = {
                sender: socket.username,
                message: msg,
            };
            socket.broadcast.emit('chat message', dataToOthers);
        });

        socket.on('disconnect', () => {
            console.log('user ' + socket.username + ' disconnected');
            // Remove the user from the users array
            users = users.filter(user => user !== socket.username);

            // Notify all users about the user who disconnected
            let dataToOthers = {
                sender: "Server",
                message: socket.username + ' has disconnected from the chat room',
            };
            io.emit('update_mess', dataToOthers);
        });
    });
};
