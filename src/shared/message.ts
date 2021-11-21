import {Vector3, Quaternion} from 'three'

interface Message {
    id: number,
    time: Date,
    position: Vector3,
    rotation: Quaternion
}

export {Message}
