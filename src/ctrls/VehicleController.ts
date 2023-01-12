export default class VehicleController {

    private readonly scene: Phaser.Scene;
    private readonly _vehicleObjects: Phaser.GameObjects.GameObject[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    get vehicleObjects(): Phaser.GameObjects.GameObject[] {
        return this._vehicleObjects;
    }

    public create() {
    }

    public update(time: number, delta: number) {
    }
}
