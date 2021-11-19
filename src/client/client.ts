import {io, Socket} from 'socket.io-client'

class Client {
    private socket: Socket
    constructor(url: string) {
        this.socket = io(url);
    }

    init(): Client {
        this.socket.on('message', (message) => {
            console.log(message);
            document.body.innerHTML += message + "/n";
        })

        this.socket.on('random', (number) => {
            console.log(`My number is ${number}`);
        })
        return this;
    }
}

export {Client}
