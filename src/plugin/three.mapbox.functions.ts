import { Matrix4, Vector3 } from "three";
import { threeMapboxConfig } from "./three.mapbox.config";
import { LngLatLike } from "mapbox-gl";

export const threeMapboxFunctions = {
    makePerspectiveMatrix: (fovy: number, aspect: number, near: number, far: number) => {
        const out = new Matrix4();
        const f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far);

        const newMatrix = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        ]

        out.elements = newMatrix
        return out;
    },
    projectedUnitsPerMeter: (latitude) => {
        return Math.abs(threeMapboxConfig.WORLD_SIZE /
            Math.cos(threeMapboxConfig.DEG2RAD * latitude) /
            threeMapboxConfig.EARTH_CIRCUMFERENCE);
    },
    projectToWorld: (coords: LngLatLike) => {
        const projected = [
            -threeMapboxConfig.MERCATOR_A * threeMapboxConfig.DEG2RAD * coords[0] * threeMapboxConfig.PROJECTION_WORLD_SIZE,
            -threeMapboxConfig.MERCATOR_A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * threeMapboxConfig.DEG2RAD * coords[1]))) * threeMapboxConfig.PROJECTION_WORLD_SIZE
        ];

        if (!coords[2]) {
            projected.push(0);
        }
        else {
            const pixelsPerMeter = this.projectedUnitsPerMeter(coords[1]);
            projected.push(coords[2] * pixelsPerMeter);
        }

        return new Vector3(projected[0], projected[1], projected[2]);
    },
};