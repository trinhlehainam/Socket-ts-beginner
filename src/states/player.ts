import { Schema, type } from "@colyseus/schema";
import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";

export class Player extends Schema {
    @type("boolean") isReady: boolean;
    @type("number") timeStamp: number;
    @type(Vector3) position: Vector3;
    @type(Quaternion) rotation: Quaternion;

    constructor() {
        super()
        this.isReady = false;
        this.timeStamp = new Date().getTime();
        this.position = new Vector3();
        this.rotation = new Quaternion();
    }
}
