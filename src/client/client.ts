import {io} from 'socket.io-client'

const client = io('http://localhost:3000');
client.emit('Hello world');