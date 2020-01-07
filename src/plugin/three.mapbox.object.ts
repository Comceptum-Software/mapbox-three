import { Object3D } from "three";
import { LngLatLike } from "mapbox-gl";
import { threeMapboxFunctions } from "./three.mapbox.functions";

export class ThreeMapboxObject {
    static userDataKey = 'three.mapbox.object';

    coordinates: LngLatLike;

    constructor(
        protected readonly native: Object3D,
        readonly units: string = 'meters',
    ) {
        native.userData[ThreeMapboxObject.userDataKey] = this;
    }

    getNative() {
        return this.native;
    }

    setCoords(coords: LngLatLike) {
        if (this.units === 'meters') {
            var s = threeMapboxFunctions.projectedUnitsPerMeter(coords[1]);
            this.native.scale.set(s, s, s);
        }

        this.coordinates = coords;
        const projected = threeMapboxFunctions.projectToWorld(coords);
        this.native.position.copy(projected);
    }
}