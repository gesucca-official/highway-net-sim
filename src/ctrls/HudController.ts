import MapController from "./MapController";
import HighwayNetController from "./HighwayNetController";
import {CardinalDirection} from "../models/CardinalDirection";

export default class HudController {

    private hudCamera; //Phaser.Cameras.Scene2D.Camera

    private readonly scene: Phaser.Scene;
    private readonly worldObjects: () => Phaser.GameObjects.GameObject[];
    private readonly hudObjects: Phaser.GameObjects.GameObject[] = [];

    private readonly mapController: MapController;
    private readonly highwayController: HighwayNetController;

    constructor(scene: Phaser.Scene, worldObjects: () => Phaser.GameObjects.GameObject[], mapController: MapController, highwayController: HighwayNetController) {
        this.scene = scene;
        this.worldObjects = worldObjects;
        this.mapController = mapController;
        this.highwayController = highwayController;
    }

    public create() {
        this.hudCamera = this.scene.cameras.add(0, 0, 800, 600).ignore(this.worldObjects());

        this.hudObjects.push(
            this.scene.add.rectangle(400, 575, 400, 50, 0x299919), // buttons area
            this.scene.add.rectangle(225, 575, 40, 40, 0x000000) // debug button
                .setInteractive()
                .on('pointerup', () => this._debugButtonPressed()),
            this.scene.add.text(215, 575, 'deb'),
            this.scene.add.rectangle(270, 575, 40, 40, 0x000000) // build straight road
                .setInteractive()
                .on('pointerup', () => this._verticalRoadButtonPressed()),
            this.scene.add.text(270, 575, '|')
        );
        this.scene.cameras.main.ignore(this.hudObjects);
    }

    private _debugButtonPressed() {
        this.mapController.drawDebugReferences();
        this.hudCamera.ignore(this.worldObjects()); // refresh the ignored objects
    }

    private _verticalRoadButtonPressed() {
        this.mapController.mapObjects.forEach(tile => {
            tile.setInteractive()
                .on('pointerup', () => {
                    // @ts-ignore
                    this.highwayController.add(tile.x, tile.y, [CardinalDirection.N, CardinalDirection.S]);
                    this.highwayController.draw();
                    this.mapController.mapObjects.forEach(tile => tile.disableInteractive());
                });
        });
    }

}
