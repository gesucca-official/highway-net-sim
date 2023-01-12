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
            this.scene.add.rectangle(270, 575, 40, 40, 0x000000) // build vertical road
                .setInteractive()
                .on('pointerup', () => this._drawRoadButtonPressed([CardinalDirection.N, CardinalDirection.S])),
            this.scene.add.text(270, 575, '|'),
            this.scene.add.rectangle(315, 575, 40, 40, 0x000000) // build horizontal road
                .setInteractive()
                .on('pointerup', () => this._drawRoadButtonPressed([CardinalDirection.W, CardinalDirection.E])),
            this.scene.add.text(315, 575, '-'),
            this.scene.add.rectangle(370, 575, 40, 40, 0x000000) // build NW curve
                .setInteractive()
                .on('pointerup', () => this._drawRoadButtonPressed([CardinalDirection.N, CardinalDirection.W])),
            this.scene.add.text(370, 575, 'NW'),
            this.scene.add.rectangle(415, 575, 40, 40, 0x000000) // build NE curve
                .setInteractive()
                .on('pointerup', () => this._drawRoadButtonPressed([CardinalDirection.N, CardinalDirection.E])),
            this.scene.add.text(415, 575, 'NE'),
            this.scene.add.rectangle(470, 575, 40, 40, 0x000000) // build SW curve
                .setInteractive()
                .on('pointerup', () => this._drawRoadButtonPressed([CardinalDirection.S, CardinalDirection.W])),
            this.scene.add.text(470, 575, 'SW'),
            this.scene.add.rectangle(515, 575, 40, 40, 0x000000) // build NE curve
                .setInteractive()
                .on('pointerup', () => this._drawRoadButtonPressed([CardinalDirection.S, CardinalDirection.E])),
            this.scene.add.text(515, 575, 'SE'),
            this.scene.add.rectangle(570, 575, 40, 40, 0x000000) // delete road
                .setInteractive()
                .on('pointerup', () => this._deleteRoadButtonPressed()),
            this.scene.add.text(570, 575, 'Del'),
            // TODO T intersections, everything is already predisposed just add buttons
        );
        this.scene.cameras.main.ignore(this.hudObjects);
    }

    private _debugButtonPressed() {
        this.mapController.drawDebugReferences();
        this.hudCamera.ignore(this.worldObjects()); // refresh the ignored objects
    }

    private _drawRoadButtonPressed(directions: CardinalDirection[]) {
        this.mapController.mapObjects.forEach(tile => {
            tile.setInteractive()
                .on('pointerup', () => {
                    // @ts-ignore
                    this.highwayController.add(tile.x, tile.y, directions);
                    this.highwayController.draw();
                    this.mapController.mapObjects.forEach(tile => {
                        tile.disableInteractive();
                        tile.removeAllListeners('pointerup')
                    });
                    this.hudCamera.ignore(this.worldObjects());
                });
        });
    }

    private _deleteRoadButtonPressed() {
        this.mapController.mapObjects.forEach(tile => {
            tile.setInteractive()
                .on('pointerup', () => {
                    // @ts-ignore
                    this.highwayController.clear(tile.x, tile.y);
                    this.mapController.mapObjects.forEach(tile => {
                        tile.disableInteractive();
                        tile.removeAllListeners('pointerup')
                    });
                });
        });
    }
}
