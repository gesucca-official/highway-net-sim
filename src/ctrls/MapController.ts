import {map0} from "../maps/map0"
import MainScene from "../scenes/MainScene";

export default class MapController {

    private readonly scene: Phaser.Scene;
    private readonly _mapObjects: Phaser.GameObjects.GameObject[] = [];
    private readonly _debugObjects: Phaser.GameObjects.GameObject[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    get mapObjects(): Phaser.GameObjects.GameObject[] {
        return [...this._mapObjects, ...this._debugObjects];
    }

    public preload() {
        this.scene.load.bitmapFont('arcade', 'fonts/arcade.png', 'fonts/arcade.xml');
    }

    public create() {
        map0.forEach((line, lineIndex) => {
            line.forEach((tile, tileIndex) => {
                if (tile == 'E')
                    this._createMonoChromeTile(tileIndex, lineIndex, 0x777777);
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
            })
        })
    }

    public drawDebugReferences() {
        const res = MainScene.TILE_RES_PX;
        if (this._debugObjects.length == 0)
            map0.forEach((line, yIndex) => {
                line.forEach((tile, xIndex) => {
                    const r1 = this.scene.add.rectangle(xIndex * res, yIndex * res, res / 100, res, 0x000000);
                    const r2 = this.scene.add.rectangle(xIndex * res, yIndex * res, res, res / 100, 0x000000);
                    const t = this.scene.add.bitmapText(xIndex * res, yIndex * res, 'arcade', xIndex + "\n" + yIndex, 8);
                    this._mapObjects.push(r1, r2, t);
                    this._debugObjects.push(r1, r2, t);
                })
            });
        else {
            this._debugObjects.forEach(obj => {
                obj.destroy(true);
            });
            this._debugObjects.splice(0, this._debugObjects.length);
        }
    }

    private _createMonoChromeTile(xIndex: number, yIndex: number, color: number) {
        const res = MainScene.TILE_RES_PX;
        this._mapObjects.push(
            this.scene.add.rectangle(xIndex * res, yIndex * res, res, res, color).setOrigin(0, 0)
        );
    }

    // TODO: this only draw NW and WS turns, and an intersection from above
    private _createRiverTile(xIndex: number, yIndex: number, orientation: string) {
        this._createMonoChromeTile(xIndex, yIndex, 0x7dcea0);
        const res = MainScene.TILE_RES_PX;
        const x = xIndex * res;
        const y = yIndex * res;
        if (orientation == '|' || orientation == '-')
            this._mapObjects.push(
                this.scene.add.rectangle(
                    orientation == '|' ? x + (res / 2) : x,
                    orientation == '-' ? y + (res / 2) : y,
                    orientation == '|' ? res / 10 : res,
                    orientation == '-' ? res / 10 : res,
                    0x21618c).setOrigin(0, 0)
            );
        else if (orientation == '>') {
            this._mapObjects.push(
                this.scene.add.rectangle(x + (res / 2), y,
                    res / 10,
                    res / 2 + (res / 10),
                    0x21618c).setOrigin(0, 0)
            );
            this._mapObjects.push(
                this.scene.add.rectangle(x, y + (res / 2),
                    res / 2, // + (res / 10) no need since it would overlaps
                    res / 10,
                    0x21618c).setOrigin(0, 0)
            );
        } else if (orientation == '<') {
            this._mapObjects.push(
                this.scene.add.rectangle(x + (res / 2), y + (res / 2),
                    res / 2,
                    res / 10,
                    0x21618c).setOrigin(0, 0)
            );
            this._mapObjects.push(
                this.scene.add.rectangle(x + (res / 2), y + (res / 2),
                    res / 10,
                    res,
                    0x21618c).setOrigin(0, 0)
            );
        } else if (orientation == 'x') {
            // beware, this overlaps another green tile over the base one
            this._createRiverTile(xIndex, yIndex, '-');
            this._mapObjects.push(
                this.scene.add.rectangle(x + (res / 2), y,
                    res / 10,
                    res / 2,
                    0x21618c).setOrigin(0, 0)
            );
        }
    }

}
