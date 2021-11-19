"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const PORT = 3000;
class App {
    constructor(port) {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.static(path_1.default.resolve(__dirname, '../client/')));
        this.server = http.createServer(app);
        this.port = port;
        this.io = new socket_io_1.Server(this.server);
    }
    init() {
        this.io.on('connection', (socket) => {
            console.log(`Player ${socket.id} is connected.`);
            socket.emit('message', `Hello ${socket.id}`);
            socket.broadcast.emit('message', `Say hello to ${socket.id}`);
            socket.on('disconnect', () => {
                console.log('socket disconected :' + socket.id);
            });
        });
        setInterval(() => {
            this.io.emit('random', Math.floor(Math.random() * 10));
        }, 1000);
        return this;
    }
    start() {
        this.server.listen(this.port, () => {
            console.log(`Listenning on ${this.port}`);
        });
    }
}
new App(PORT).init().start();
//# sourceMappingURL=index.js.map