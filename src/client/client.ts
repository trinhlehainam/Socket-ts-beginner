import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as Colyseus from "colyseus.js"

import {GameState} from '../states/gameState'
import {Player} from '../states/player'
import {MESSAGES} from '../constants/messages'
import {ROOM} from '../constants/rooms'

class Client {

    private client: Colyseus.Client
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private camera: THREE.Camera

    private entities: Map<string, THREE.Mesh>
    private player: THREE.Mesh
    private room?: Colyseus.Room<GameState>

    constructor() {
        this.client = new Colyseus.Client("ws://localhost:3000");

        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.onResizeWindow.bind(this));

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45, window.innerWidth/ window.innerHeight,
            0.1, 100
        );
        this.camera.position.set(0, 3, 3);

        new OrbitControls(this.camera, this.renderer.domElement);

        const groundMesh = new THREE.PlaneGeometry(60, 40);
        const groundMat = new THREE.MeshBasicMaterial({color: 0x777777});
        const ground = new THREE.Mesh(groundMesh, groundMat);
        ground.rotateX(-Math.PI/2);
        this.scene.add(ground);

        this.entities = new Map();
        const cubeMesh = new THREE.BoxGeometry(1, 1, 1);
        const cubeMat = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.player = new THREE.Mesh(cubeMesh, cubeMat);
        this.player.position.setY(0.5);
        this.scene.add(this.player);

        console.log('Client init');
    }

    async init(): Promise<Client> {
        const room = await this.client.joinOrCreate<GameState>(ROOM.GAME_ROOM);
        this.room = room;

        room.onMessage(MESSAGES.SERVER_INIT, (id: string) => {
            this.entities.set(id, this.player);
            console.log(id);
            const state: Player = new Player();

            state.position.x = this.player.position.x;
            state.position.y = this.player.position.y;
            state.position.z = this.player.position.z;

            state.rotation.x = this.player.quaternion.x;
            state.rotation.y = this.player.quaternion.y;
            state.rotation.z = this.player.quaternion.z;
            state.rotation.w = this.player.quaternion.w;

            room.send(MESSAGES.CLIENT_INIT, state);
        });

        room.onMessage(MESSAGES.CLIENT_JOIN, (players: {[key: string]: Player}) => {
            console.log(players);

            for (const id in players) {
                const player = players[id];
                if (this.entities.has(id) || !player) continue;

                const cubeMesh = new THREE.BoxGeometry(1, 1, 1);
                const cubeMat = new THREE.MeshBasicMaterial({color: 0xff0000});
                const entity = new THREE.Mesh(cubeMesh, cubeMat);

                entity.position.setY(player.position.y);
                entity.position.setX(player.position.x);
                entity.position.setZ(player.position.z);

                const quaternion = new THREE.Quaternion(
                    player.rotation.x,
                    player.rotation.y,
                    player.rotation.z,
                    player.rotation.w
                );

                entity.quaternion.copy(quaternion);

                this.entities.set(id, entity);
                this.scene.add(entity);
            }
        });

        room.onMessage(MESSAGES.CLIENT_LEAVE, (client_sessionId: string) => {
            const left_player = this.entities.get(client_sessionId);
            if (left_player)
                this.scene.remove(left_player);
            this.entities.delete(client_sessionId);
        });

        room.onMessage(MESSAGES.UPDATE_CLIENT_STATE, (players: {[key: string]: Player}) => {
            for (const id in players) {
                const player = players[id];
                const entity = this.entities.get(id);
                if (!entity || !player) continue;

                entity!.position.setX(player.position.x);
                entity!.position.setY(player.position.y);
                entity.position.setZ(player.position.z);

                const quaternion = new THREE.Quaternion(
                    player.rotation.x,
                    player.rotation.y,
                    player.rotation.z,
                    player.rotation.w
                );

                entity.quaternion.copy(quaternion);

                this.entities.set(id, entity);
                this.scene.add(entity);
            }
        })
        
        this.renderer.setAnimationLoop(this.loop.bind(this));

        window.addEventListener('keydown', this.onKeyDown.bind(this));

        return this;
    }

    private loop() {
         
        this.renderer.render(this.scene, this.camera);
    }

    private onResizeWindow(): void {
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 37:
                this.player.translateX(0.1);
                break;
            case 39:
                this.player.translateX(-0.1);
                break;
            case 38:
                this.player.translateZ(0.1);
                break;
            case 40:
                this.player.translateZ(-0.1);
                break;
        }

        const state: Player = new Player();

        state.position.x = this.player.position.x;
        state.position.y = this.player.position.y;
        state.position.z = this.player.position.z;

        state.rotation.x = this.player.quaternion.x;
        state.rotation.y = this.player.quaternion.y;
        state.rotation.z = this.player.quaternion.z;
        state.rotation.w = this.player.quaternion.w;

        this.room!.send(MESSAGES.CLIENT_CHANGE, state);
    }
}

export {Client}
