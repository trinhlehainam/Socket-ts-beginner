import express from 'express'
import path from 'path'
import * as http from 'http'
import {Server} from 'socket.io'

const PORT = 3000;

class App {
    private server: http.Server
    private port: number
    private io: Server
    private broadcast_rate: number
    private client_ids: Array<string>
    private client_messages: Array<any>

    constructor(port: number) {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use(express.static(path.resolve(__dirname, '../client/')));

        this.server = http.createServer(app);
        this.port = port;
        this.io = new Server(this.server);
        this.broadcast_rate = 60;
        this.client_ids = [];
        this.client_messages = [];
    }

    init(): App {
        this.io.on('connection', (socket) => {
            console.log(`Player ${socket.id} is connected.`); 

            socket.emit('message', `Hello ${socket.id}`);

            // Init client
            this.client_ids.push(socket.id);
            socket.emit('init', this.client_ids.length - 1);

            // Recieve message from client
            socket.on('client_update', (message) => {
                const id = message.id;
                this.client_messages[id] = message;
            });

            // Broadcast to all other about this client
            socket.broadcast.emit('join', this.client_ids.length - 1);
            socket.broadcast.emit('message', `Say hello to ${socket.id}`);
            setInterval(() => {
                socket.emit('server_update', this.client_messages);
            }, 1000/60);

            socket.on('disconnect', () => {
                console.log('socket disconected :' + socket.id);
            });

            console.log(this.client_ids);
            console.log(this.client_messages);
        });

        return this;
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Listenning on port ${this.port}`);
        });
    }
}

new App(PORT).init().start();
