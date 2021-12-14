"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const colyseus_1 = require("colyseus");
const monitor_1 = require("@colyseus/monitor");
const myroom_1 = require("./Rooms/myroom");
const PORT = Number(process.env.PORT || 3000);
class App {
    constructor(port) {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.static(path_1.default.resolve(__dirname, '../client/')));
        app.use('/colyseus', (0, monitor_1.monitor)());
        this.server = new colyseus_1.Server({ server: (0, http_1.createServer)(app) });
        this.port = port;
        this.broadcast_rate = 60;
        this.client_ids = [];
        this.client_states = [];
    }
    init() {
        this.server.define("MyRoom", myroom_1.MyRoom);
        return this;
    }
    start() {
        this.server.listen(this.port);
    }
}
new App(PORT).init().start();
//# sourceMappingURL=index.js.map