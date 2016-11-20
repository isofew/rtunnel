rtunnel
------
Reverse Tunnel Utility

### Usage
```bash
node server.js \
	--remote [websocket listening port] \
    --local [forwarding port]
    
node client.js \
	--remote (ws|wss)://server:port/path \
    --local [forwarding port]
```
The above commands will set up a reverse tunnel so that any connection 
to server's local port will be forwarded to client's local port.

Notice that server's 'remote' port is still on that server, it's just a 
name.
