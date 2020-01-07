import { ThreeMapboxRenderer } from "./three.mapbox.renderer";
import { threeMapboxConfig } from "./three.mapbox.config";
import { Matrix4 } from "three";
import { threeMapboxFunctions } from "./three.mapbox.functions";

export class ThreeMapboxCamera {
    state = {
        fov: 0.6435011087932844,
        translateCenter: new Matrix4,
        worldSizeRatio: 512 / threeMapboxConfig.WORLD_SIZE,
        cameraToCenterDistance: null,
        cameraTranslateZ: null,
        topHalfSurfaceDistance: null,
    };

    protected get mapTransform() {
        return this.renderer.map['transform'];
    }

    constructor(protected readonly renderer: ThreeMapboxRenderer) {
        this.renderer.camera.matrixAutoUpdate = false;

        this.renderer.world.position.x = this.renderer.world.position.y = threeMapboxConfig.WORLD_SIZE / 2
        this.renderer.world.matrixAutoUpdate = false;

        this.state.translateCenter.makeTranslation(threeMapboxConfig.WORLD_SIZE / 2, -threeMapboxConfig.WORLD_SIZE / 2, 0);

        this.renderer.map
            .on('move', () => this.updateCamera())
            .on('resize', () => this.setupCamera())

        this.setupCamera();
    }

    protected setupCamera() {
        const t = this.mapTransform;
        const halfFov = this.state.fov / 2;
        const cameraToCenterDistance = 0.5 / Math.tan(halfFov) * t.height;
        const groundAngle = Math.PI / 2 + t._pitch;

        this.state.cameraToCenterDistance = cameraToCenterDistance;
        this.state.cameraTranslateZ = new Matrix4().makeTranslation(0, 0, cameraToCenterDistance);
        this.state.topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);

        this.updateCamera();
    }

    protected updateCamera() {
        const t = this.mapTransform;
        const furthestDistance = Math.cos(Math.PI / 2 - t._pitch) * this.state.topHalfSurfaceDistance + this.state.cameraToCenterDistance;
        const farZ = furthestDistance * 1.01;

        this.renderer.camera.projectionMatrix = threeMapboxFunctions.makePerspectiveMatrix(this.state.fov, t.width / t.height, 1, farZ);

        const cameraWorldMatrix = new Matrix4();
        const rotatePitch = new Matrix4().makeRotationX(t._pitch);
        const rotateBearing = new Matrix4().makeRotationZ(t.angle);

        // Unlike the Mapbox GL JS camera, separate camera translation and rotation out into its world matrix
        // If this is applied directly to the projection matrix, it will work OK but break raycasting

        cameraWorldMatrix
            .premultiply(this.state.cameraTranslateZ)
            .premultiply(rotatePitch)
            .premultiply(rotateBearing)

        this.renderer.camera.matrixWorld.copy(cameraWorldMatrix);

        const zoomPow = t.scale * this.state.worldSizeRatio;

        // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera
        const scale = new Matrix4;
        const translateMap = new Matrix4;
        const rotateMap = new Matrix4;

        scale.makeScale(zoomPow, zoomPow, zoomPow);

        const x = -this.mapTransform.x || -this.mapTransform.point.x;
        const y = this.mapTransform.y || this.mapTransform.point.y;

        translateMap
            .makeTranslation(x, y, 0);

        rotateMap
            .makeRotationZ(Math.PI);

        this.renderer.world.matrix = new Matrix4;
        this.renderer.world.matrix
            .premultiply(rotateMap)
            .premultiply(this.state.translateCenter)
            .premultiply(scale)
            .premultiply(translateMap)
    }
}