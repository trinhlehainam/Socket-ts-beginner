import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {Client} from './client'

class App {
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private camera: THREE.Camera

    private player: Client
    private client: Array<Client>

    constructor() {
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45, window.innerWidth/ window.innerHeight,
            0.1, 100
        );

        new OrbitControls(this.camera, this.renderer.domElement);
    }

    run() {

    }
}

export {App}