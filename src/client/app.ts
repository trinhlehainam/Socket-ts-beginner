import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {Message} from '../shared/message'

class App {
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private camera: THREE.Camera

    private entities: Array<THREE.Mesh>

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

        this.entities = [];
    }

    init() {
        this.renderer.setAnimationLoop(this.run.bind(this));
    }

    getMessages() {
        const messages: Array<Message> = [];
    }

    run() {
        this.renderer.render(this.scene, this.camera);
    }
}

export {App}
