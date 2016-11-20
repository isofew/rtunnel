var logger = require('logplease').create('rtunnel')
var argv = require('optimist').argv

var net = require('net')
var ws = require('ws')
var ID = require('./id')

var wServer = new ws.Server({port:argv.remote})
var wSocket = null

wServer.on('connection', socket => {
  logger.info('new websocket connection')
  wSocket = socket
  .on('message', data => ID.dispense(data, (id, data) => {
    wSocket.emit(id, data)
  }))
  .on('ping', () => wSocket.pong())
})

server = net.createServer(socket => {
  if (!wSocket) {
    logger.error('no websocket available')
    socket.destroy()
    return
  }
  var id = ID.gen()
  ID.bind(id, wSocket, socket)
})

server.listen(argv.local)
