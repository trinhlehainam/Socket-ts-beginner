import { Room, Client } from "colyseus"

import { GameState } from '../../states/gameState'
import { Player } from "../../states/player";
import { MESSAGES } from "../../messages/messages"

export class MyRoom extends Room<GameState> {
    maxClients = 4;
    onCreate (options: any) {
        this.setState(new GameState());
        this.onMessage('greet', (client, message) => {
            // handle "type" message
        });

        this.onMessage(MESSAGES.CLIENT_CHANGE, (client, state: Player) => {
            console.log(state);
            const player = this.state.players.get(client.sessionId);
            player.timeStamp = state.timeStamp;

            player.position.x = state.position.x;
            player.position.y = state.position.y;
            player.position.z = state.position.z;

            player.rotation.x = state.rotation.x;
            player.rotation.y = state.rotation.y;
            player.rotation.z = state.rotation.z;
            player.rotation.w = state.rotation.w;

            this.broadcast(MESSAGES.UPDATE_CLIENT_STATE, this.state.players);
        });
    }

    onJoin (client: Client, options: any) {
        this.state.players.set(client.sessionId, new Player());
        client.send(MESSAGES.SERVER_INIT, client.sessionId);

        this.onMessage(MESSAGES.CLIENT_INIT, (client, state: Player) => {
            console.log(state);
            const player = this.state.players.get(client.sessionId);
            player.timeStamp = state.timeStamp;

            player.position.x = state.position.x;
            player.position.y = state.position.y;
            player.position.z = state.position.z;

            player.rotation.x = state.rotation.x;
            player.rotation.y = state.rotation.y;
            player.rotation.z = state.rotation.z;
            player.rotation.w = state.rotation.w;

            this.broadcast(MESSAGES.CLIENT_JOIN, this.state.players);
        });
    }

    onLeave (client: Client, consented: boolean) {
        this.state.players.delete(client.sessionId);
        this.broadcast(MESSAGES.CLIENT_LEAVE, client.sessionId);
    }

    onDispose() {
    }
}
