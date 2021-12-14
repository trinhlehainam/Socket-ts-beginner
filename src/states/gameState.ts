import { Schema, type } from "@colyseus/schema";
import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";

export class GameState extends Schema {
    @type("number") id: number;
    @type("number") date: number;
    @type(Vector3) position: Vector3;
    @type(Quaternion) rotation: Quaternion;

    constructor() {
        super()
        this.id = 1;
        this.date = new Date().getDate();
        this.position = new Vector3();
        this.rotation = new Quaternion();
    }
}