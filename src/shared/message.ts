import {Vector3, Quaternion} from 'three'

interface Message {
    id: number,
    time: Date,
    pos: Vector3,
    rotation: Quaternion
}

export {Message}
