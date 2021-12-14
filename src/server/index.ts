import express from 'express'
import path from 'path'
import {createServer} from 'http'
import {Server} from "colyseus"
import {monitor} from "@colyseus/monitor"

import { MyRoom } from './Rooms/myroom'

const PORT = Number(process.env.PORT || 3000);

class App {
    private port: number
    private server: Server
    private broadcast_rate: number
    private client_ids: Array<string>
    private client_states: Array<any>

    constructor(port: number) {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use(express.static(path.resolve(__dirname, '../client/')));
        app.use('/colyseus', monitor());

        this.server = new Server({server: createServer(app)});
        this.port = port;
        this.broadcast_rate = 60;
        this.client_ids = [];
        this.client_states = [];
    }

    init(): App {
        this.server.define("MyRoom", MyRoom);

        return this;
    }

    start() {
        this.server.listen(this.port);
    }
}

new App(PORT).init().start();
