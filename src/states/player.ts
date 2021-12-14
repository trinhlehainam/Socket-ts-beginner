import { Schema, type } from "@colyseus/schema";
import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";

export class Player extends Schema {
    @type("number") date: number;
    @type(Vector3) position: Vector3;
    @type(Quaternion) rotation: Quaternion;

    constructor() {
        super()
        this.date = new Date().getTime();
        this.position = new Vector3();
        this.rotation = new Quaternion();
    }
}
