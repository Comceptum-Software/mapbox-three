import { CustomLayerInterface, Map } from "mapbox-gl";
import { ThreeMapboxRenderer } from "./three.mapbox.renderer";
import { Object3D } from "three";
import { ThreeMapboxObject } from "./three.mapbox.object";

export class ThreeMapboxLayer implements CustomLayerInterface {
    readonly type = 'custom';

    protected renderer: ThreeMapboxRenderer;

    get native() {
        return this.renderer;
    }

    constructor(readonly id: string) { }

    add(object: Object3D) {
        const wrapped = new ThreeMapboxObject(object, 'meters');
        this.renderer.world.add(wrapped.getNative());
        return wrapped;
    }

    onAdd(map: Map, gl: WebGLRenderingContext) {
        this.renderer = new ThreeMapboxRenderer(map, gl);
    }

    render(gl: WebGLRenderingContext, matrix: number[]) {
        this.renderer.render(gl, matrix);
    }
}