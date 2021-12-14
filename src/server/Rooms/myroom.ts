import { Room, Client } from "colyseus"

import { GameState } from '../../states/gameState'
import { Player } from "../../states/player";
import { MESSAGES } from "../../messages/messages"

export class MyRoom extends Room<GameState> {
    maxClients = 4;
    onCreate (options: any) {
        this.setState(new GameState());
        this.onMessage(MESSAGES.MOVE, (client, message) => {
            // handle "type" message
            console.log(`${client.sessionId}: ${message}`);
        });
    }

    onJoin (client: Client, options: any) {
        this.state.players.set(client.sessionId, new Player());
    }

    onLeave (client: Client, consented: boolean) {
        this.state.players.delete(client.sessionId);
    }

    onDispose() {
    }
}
