import Phaser from "phaser";
import {map0} from "../maps/map0"
import MapController from "../ctrls/MapController";

export default class MainScene extends Phaser.Scene {

    public static readonly DEBUG = true;
    public static readonly TILE_RES_PX = 50;

    private controls;

    private mapController: MapController;

    constructor() {
        super('main-scenes');
        this.mapController = new MapController(this);
    }

    preload(): void {
        this.mapController.preload();
    }

    create(): void {
        this.mapController.create();
        this._setCameraControls();
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
        this.cameras.main.setBounds(0, 0, xLen * MainScene.TILE_RES_PX, yLen * MainScene.TILE_RES_PX)
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.controls.update(delta);
    }

}
