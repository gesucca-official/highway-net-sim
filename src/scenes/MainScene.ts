import Phaser from "phaser";
import {map0} from "../maps/map0"

export default class MainScene extends Phaser.Scene {

    private static TILE_RES_PX = 50;

    private cursors;
    private controls;

    constructor() {
        super('main-scenes');
    }

    preload(): void {
    }

    create(): void {
        this._setCameraControls();

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
            })
        })
    }

    private _setCameraControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
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

    private _createMonoChromeTile(xIndex: number, yIndex: number, color: number) {
        const res = MainScene.TILE_RES_PX;
        this.add.rectangle(xIndex * res, yIndex * res, res, res, color)
    }

    // TODO: this only draw NW and WS turns, and an intersection from above
    private _createRiverTile(xIndex: number, yIndex: number, orientation: string) {
        this._createMonoChromeTile(xIndex, yIndex, 0x7dcea0);
        const res = MainScene.TILE_RES_PX;
        if (orientation == '|' || orientation == '-')
            this.add.rectangle(xIndex * res, yIndex * res,
                orientation == '|' ? res / 10 : res,
                orientation == '-' ? res / 10 : res,
                0x21618c);
        else if (orientation == '>') {
            this.add.rectangle(xIndex * res, yIndex * res - (res / 2),
                res / 10,
                res,
                0x21618c);
            this.add.rectangle(xIndex * res - (res / 2), yIndex * res,
                res,
                res / 10,
                0x21618c);
        } else if (orientation == '<') {
            this.add.rectangle(xIndex * res + (res / 2), yIndex * res,
                res,
                res / 10,
                0x21618c);
            this.add.rectangle(xIndex * res, yIndex * res + (res / 2),
                res / 10,
                res,
                0x21618c);
        } else if (orientation == 'x') {
            // beware, this overlaps another green tile over the base one
            this._createRiverTile(xIndex, yIndex, '-');
            this.add.rectangle(xIndex * res, yIndex * res - (res / 2),
                res / 10,
                res,
                0x21618c);
        }
    }

}
