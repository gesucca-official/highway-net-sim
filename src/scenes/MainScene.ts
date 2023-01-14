import Phaser from "phaser";
import {map0} from "../maps/map0"
import MapController from "../ctrls/MapController";
import HudController from "../ctrls/HudController";
import HighwayNetController from "../ctrls/HighwayNetController";
import VehicleController from "../ctrls/VehicleController";

export default class MainScene extends Phaser.Scene {

    public static readonly TILE_RES_PX = 50;

    private controls;

    private readonly mapController: MapController;
    private readonly hudController: HudController;
    private readonly vehicleController: VehicleController;
    private readonly highwayNetController: HighwayNetController;

    constructor() {
        super('main-scenes');
        this.mapController = new MapController(this);
        this.highwayNetController = new HighwayNetController(this);
        this.vehicleController = new VehicleController(this);
        this.hudController = new HudController(this,
            () => [
                ...this.mapController.mapObjects,
                ...this.highwayNetController.highwayNetworkGraphicObjs,
                ...this.vehicleController.vehicleObjects],
            this.mapController,
            this.highwayNetController,
            this.vehicleController);
    }

    preload(): void {
        this.mapController.preload();
    }

    create(): void {
        this._setCameraControls();
        this.mapController.create();
        this.highwayNetController.create();
        this.hudController.create();
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.controls.update(delta);
        this.vehicleController.update(time, delta);
    }

    private _setCameraControls() {
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.10,
            drag: 0.0005,
            maxSpeed: 1.0
        });

        const xLen = map0[0].length;
        const yLen = map0.length;
        this.cameras.main.setBounds(0, 0, (xLen - 1) * MainScene.TILE_RES_PX, (yLen - 1) * MainScene.TILE_RES_PX)
    }

}
