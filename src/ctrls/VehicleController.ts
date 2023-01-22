import IdealCarDriver from "../models/IdealCarDriver";
import Vehicle from "../models/Vehicle";
import MainScene from "../scenes/MainScene";
import HighwayTile from "../models/HighwayTile";
import SlowCarDriver from "../models/SlowCarDriver";

export default class VehicleController {

    public static FAST_FORWARD_FACTOR = 10;

    private readonly scene: Phaser.Scene;
    private readonly getHighwayNetwork: () => HighwayTile[];

    private _vehicleObjects: Vehicle[] = [];

    constructor(scene: Phaser.Scene, getHighwayNetwork: () => HighwayTile[]) {
        this.scene = scene;
        this.getHighwayNetwork = getHighwayNetwork;
    }

    get vehicleObjects(): Phaser.GameObjects.GameObject[] {
        return this._vehicleObjects.map<Phaser.GameObjects.GameObject>(o => o.getGraphObj());
    }

    public spawnVehicles() {
    }

    public DEBUG_spawnFastDriver() {
        const res = MainScene.TILE_RES_PX;
        this._vehicleObjects.push(
            new IdealCarDriver(
                [14 * res + res / 2, 33 * res + res / 2],
                [0, 0],
                (pos: [number, number]) => this.fetchVehiclePos(pos[0], pos[1]),
                this.scene)
        );
    }

    public DEBUG_spawnSlowDriver() {
        const res = MainScene.TILE_RES_PX;
        this._vehicleObjects.push(
            new SlowCarDriver(
                [14 * res + res / 2, 33 * res + res / 2],
                [0, 0],
                (pos: [number, number]) => this.fetchVehiclePos(pos[0], pos[1]),
                this.scene),
        );
    }

    public update(time: number, delta: number) {
        this._vehicleObjects.forEach(
            (v, i) => {
                this._vehicleObjects.forEach((ov, o) => {
                    if (i != o && Phaser.Geom.Intersects.CircleToCircle(v.getSafetyBoundary(), ov.getSafetyBoundary())
                        && v.lane === ov.lane && v.dir == ov.dir) {
                        v.aboutToCrashInto(ov, delta);
                        ov.aboutToCrashInto(v, delta)
                    }
                    if (i != o && Phaser.Geom.Intersects.CircleToCircle(v.getCrashBoundary(), ov.getCrashBoundary())) {
                        v.getGraphObj().destroy();
                        ov.getGraphObj().destroy();
                        v.id = 'kill me';
                        ov.id = 'kill me'
                        console.log('Incident!');
                    }
                })
                v.update(time, delta);
            }
        );
        this._vehicleObjects = this._vehicleObjects.filter(v => v.id !== 'kill me');
    }

    private fetchVehiclePos(x: number, y: number): HighwayTile {
        const highwayNet = this.getHighwayNetwork();
        for (let i = 0; i < highwayNet.length; i++)
            if (highwayNet[i].realGraphicX <= x && x < highwayNet[i].realGraphicX + MainScene.TILE_RES_PX)
                if (highwayNet[i].realGraphicY <= y && y < highwayNet[i].realGraphicY + MainScene.TILE_RES_PX)
                    return highwayNet[i];
        // else
        return {
            realGraphicX: 0,
            realGraphicY: 0,
            directions: [],
            lanesQty: 0,
            graphicObj: []
        }
    }
}
