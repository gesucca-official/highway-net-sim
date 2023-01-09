import {map0} from "../maps/map0"
import MainScene from "../scenes/MainScene";

export default class MapController {

    private readonly scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public preload() {
        this.scene.load.bitmapFont('arcade', 'fonts/arcade.png', 'fonts/arcade.xml');
    }

    public create() {
        map0.forEach((line, lineIndex) => {
            line.forEach((tile, tileIndex) => {
                if (tile == 'p')
                    this._createMonoChromeTile(tileIndex, lineIndex, 0x7dcea0);
                if (tile == 'h')
                    this._createMonoChromeTile(tileIndex, lineIndex, 0xf4d03f);
                if (tile == 'm')
                    this._createMonoChromeTile(tileIndex, lineIndex, 0xdc7633);
                if (tile == 's')
                    this._createMonoChromeTile(tileIndex, lineIndex, 0x21618c);
                if (tile == 'c')
                    this._createMonoChromeTile(tileIndex, lineIndex, 0xa6acaf);
                if (tile == '|' || tile == '-' || tile == '<' || tile == '>' || tile == 'x')
                    this._createRiverTile(tileIndex, lineIndex, tile);

                if (MainScene.DEBUG) this._drawDebugReferences(tileIndex, lineIndex);
            })
        })
    }

    private _createMonoChromeTile(xIndex: number, yIndex: number, color: number) {
        const res = MainScene.TILE_RES_PX;
        this.scene.add.rectangle(xIndex * res, yIndex * res, res, res, color).setOrigin(0, 0);
    }

    // TODO: this only draw NW and WS turns, and an intersection from above
    private _createRiverTile(xIndex: number, yIndex: number, orientation: string) {
        this._createMonoChromeTile(xIndex, yIndex, 0x7dcea0);
        const res = MainScene.TILE_RES_PX;
        const x = xIndex * res;
        const y = yIndex * res;
        if (orientation == '|' || orientation == '-')
            this.scene.add.rectangle(
                orientation == '|' ? x + (res / 2) : x,
                orientation == '-' ? y + (res / 2) : y,
                orientation == '|' ? res / 10 : res,
                orientation == '-' ? res / 10 : res,
                0x21618c).setOrigin(0, 0);
        else if (orientation == '>') {
            this.scene.add.rectangle(x + (res / 2), y,
                res / 10,
                res / 2 + (res / 10),
                0x21618c).setOrigin(0, 0);
            this.scene.add.rectangle(x, y + (res / 2),
                res / 2, // + (res / 10) no need since it would overlaps
                res / 10,
                0x21618c).setOrigin(0, 0);
        } else if (orientation == '<') {
            this.scene.add.rectangle(x + (res / 2), y + (res / 2),
                res / 2,
                res / 10,
                0x21618c).setOrigin(0, 0);
            this.scene.add.rectangle(x + (res / 2), y + (res / 2),
                res / 10,
                res,
                0x21618c).setOrigin(0, 0);
        } else if (orientation == 'x') {
            // beware, this overlaps another green tile over the base one
            this._createRiverTile(xIndex, yIndex, '-');
            this.scene.add.rectangle(x + (res / 2), y,
                res / 10,
                res / 2,
                0x21618c).setOrigin(0, 0);
        }
    }

    private _drawDebugReferences(xIndex: number, yIndex: number) {
        const res = MainScene.TILE_RES_PX;
        this.scene.add.rectangle(xIndex * res, yIndex * res, res / 100, res, 0x000000);
        this.scene.add.rectangle(xIndex * res, yIndex * res, res, res / 100, 0x000000);
        this.scene.add.bitmapText(xIndex * res, yIndex * res, 'arcade', xIndex + "\n" + yIndex, 8);
    }

}