import { Schema, type } from "@colyseus/schema";

export class Quaternion extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") z: number;
    @type("number") w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1){
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}