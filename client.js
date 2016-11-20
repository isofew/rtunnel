var logger = require('logplease').create('rtunnel')
var argv = require('optimist').argv

var net = require('net')
var ws = require('ws')
var ID = require('./id')

var wSocket = new ws(argv.remote)
var socket = {}

var interval = 30000 // keep alive
var lastPong

wSocket.on('open', () => {
  logger.info('websocket server connected')

  var timer = setInterval(() => {
    if (Date.now() - lastPong > interval) {
      logger.error('no pong received, aborted')
      process.exit()
    }
    wSocket.ping()
  }, interval)

  lastPong = Date.now()
  wSocket.on('pong', () => lastPong = Date.now())

  wSocket.on('message', data => ID.dispense(data, (id, data) => {
    if (socket[id])
      wSocket.emit(id, data)
    else
      socket[id] = net.connect(argv.local, () => {
        ID.bind(id, wSocket, socket[id])
        socket[id].write(data)
      })
  }))
})

wSocket.on('close', () => process.exit())
