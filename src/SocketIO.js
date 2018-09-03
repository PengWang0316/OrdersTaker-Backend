module.exports = (app, credentials) => {
  // Setting up the Socket Io
  const socketIoHttps = require('https').Server(credentials, app);
  const io = require('socket.io')(socketIoHttps);
  app.set('socketio', io); // Setting the io to the app variable

  // // ************* Start the Socket IO functions ************* //
  io.on('connection', () => console.log('connect'));

  // Starting the SocketIo server
  socketIoHttps.listen(process.env.WEB_SOCKET_PORT, () => console.log(`Socket.io is listening on ${process.env.WEB_SOCKET_PORT}`));
}

