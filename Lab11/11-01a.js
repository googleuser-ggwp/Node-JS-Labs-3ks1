const fs = require('fs');
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');
ws.on('open', () =>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf-8'});
    let rfile = fs.createReadStream('./MyFile.txt');
    rfile.pipe(duplex);
})