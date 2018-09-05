const https = require('https');
const socketio = require('socket.io');
const { SOCKETIO } = require('./config');

module.exports = (app, credentials) => {
  // Setting up the Socket Io
  const socketIoHttps = https.Server(credentials, app);
  const io = socketio(socketIoHttps);
  app.set(SOCKETIO, io); // Setting the io to the app variable

  // // ************* Start the Socket IO functions ************* //
  // io.on('connection', socket => {
  //   socket.on(SOCKETIO_EVENT_ADD_NEW_ORDER, data => {
  //     console.log(data);
  //   });
  // });

  // Starting the SocketIo server
  socketIoHttps.listen(process.env.WEB_SOCKET_PORT, () => console.log(`Socket.io is listening on ${process.env.WEB_SOCKET_PORT}`));
};
