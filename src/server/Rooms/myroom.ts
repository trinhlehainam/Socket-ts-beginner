import {Room, Client} from "colyseus"

import { GameState } from '../../states/gameState'

export class MyRoom extends Room<GameState> {
    onCreate (options: any) {
      this.setState(new GameState());
        this.onMessage("type", (client, message) => {
          // handle "type" message
        });
      }
    
      onJoin (client: Client, options: any) {
      }
    
      onLeave (client: Client, consented: boolean) {
      }
    
      onDispose() {
      }
}