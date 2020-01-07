import { Map } from "mapbox-gl";
import { WebGLRenderer, Scene, PerspectiveCamera, Group, Raycaster } from "three";
import { ThreeMapboxCamera } from "./three.mapbox.camera";
import { ThreeMapboxObject } from "./three.mapbox.object";

export class ThreeMapboxRenderer {
    readonly renderer: WebGLRenderer;
    readonly world: Group;
    readonly scene: Scene;
    readonly camera: PerspectiveCamera;
    readonly rayCaster: Raycaster;

    protected readonly cameraSync: ThreeMapboxCamera;

    constructor(
        readonly map: Map,
        protected readonly gl: WebGLRenderingContext,
    ) {
        this.renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: map.getCanvas(),
            context: gl
        });

        this.renderer.shadowMap.enabled = true;
        this.renderer.autoClear = false;

        this.world = new Group();
        this.scene = new Scene();
        this.rayCaster = new Raycaster();
        this.camera = new PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.000000000001, Infinity);
        this.cameraSync = new ThreeMapboxCamera(this);

        this.scene.add(this.world);
    }

    get objects() {
        return this.world.children.map(e =>
            e.userData[ThreeMapboxObject.userDataKey] as ThreeMapboxObject);
    }

    render(gl: WebGLRenderingContext, matrix: number[]) {
        if (this.map.repaint) {
            this.map.repaint = false;
        }

        this.renderer.state.reset();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
}