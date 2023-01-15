import IdealCarDriver from "../models/IdealCarDriver";
import Vehicle from "../models/Vehicle";
import MainScene from "../scenes/MainScene";
import HighwayTile from "../models/HighwayTile";

export default class VehicleController {

    public static FAST_FORWARD_FACTOR = 10;

    private readonly scene: Phaser.Scene;
    private readonly _vehicleObjects: Vehicle[] = [];

    private readonly getHighwayNetwork: () => HighwayTile[];

    constructor(scene: Phaser.Scene, getHighwayNetwork: () => HighwayTile[]) {
        this.scene = scene;
        this.getHighwayNetwork = getHighwayNetwork;
    }

    get vehicleObjects(): Phaser.GameObjects.GameObject[] {
        return this._vehicleObjects.map<Phaser.GameObjects.GameObject>(o => o.getGraphObj());
    }

    public spawnVehicles() {
        const res = MainScene.TILE_RES_PX;
        this._vehicleObjects.push(
            new IdealCarDriver(
                [14 * res + res / 2, 33 * res + res / 2],
                [0, 0],
                (pos: [number, number]) => this.fetchVehiclePos(pos[0], pos[1]),
                this.scene)
        );
    }

    public update(time: number, delta: number) {
        this._vehicleObjects.forEach(
            v => v.update(time, delta)
        );
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
