import IdealCarDriver from "../models/IdealCarDriver";
import Vehicle from "../models/Vehicle";
import MainScene from "../scenes/MainScene";

export default class VehicleController {

    private readonly scene: Phaser.Scene;
    private readonly _vehicleObjects: Vehicle[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    get vehicleObjects(): Phaser.GameObjects.GameObject[] {
        return this._vehicleObjects.map<Phaser.GameObjects.GameObject>(o => o.getGraphObj());
    }

    public create() {
        const res = MainScene.TILE_RES_PX;
        this._vehicleObjects.push(
            new IdealCarDriver(
                [14 * res + res / 2, 33 * res + res / 2],
                [0, 0], this.scene)
        );
    }

    public update(time: number, delta: number) {
        this._vehicleObjects.forEach(
            v => v.update(time, delta)
        );
    }
}
