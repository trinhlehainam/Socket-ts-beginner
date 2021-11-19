import {io, Socket} from 'socket.io-client'
import {Vector3, Quaternion} from 'three'

interface Data {
    time: Date,
    position: Vector3,
    rotation: Quaternion
}

class Client {
    private socket: Socket
    public data: Data
    constructor() {
        this.socket = io();
        
        this.data = {
            time: new Date(),
            position: new Vector3(),
            rotation: new Quaternion()
        };
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
