import {io, Socket} from 'socket.io-client'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {Message} from "../shared/message"

class Client {
    private socket: Socket

    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private camera: THREE.Camera

    private entities: Array<THREE.Mesh>
    private entity_id: number
    private player: THREE.Mesh

    constructor() {
        this.socket = io('http://localhost:3000');

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

        this.entity_id = -1;
        this.entities = [];
        const cubeMesh = new THREE.BoxGeometry(1, 1, 1);
        const cubeMat = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.player = new THREE.Mesh(cubeMesh, cubeMat);
        this.scene.add(this.player);

        console.log('Client init');
    }

    init(): Client {
        this.socket.on('init', (entity_id) => {
            this.entity_id = entity_id;
            this.entities[this.entity_id] = this.player;
        });

        this.socket.on('message', (message) => {
            console.log(message);
            document.body.innerHTML += message + "/n";
        })

        this.socket.emit('client_update');

        this.renderer.setAnimationLoop(this.loop.bind(this));

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
}

export {Client}
