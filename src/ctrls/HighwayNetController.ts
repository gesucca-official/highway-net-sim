import {map0} from "../maps/map0"
import HighwayTile from "../models/HighwayTile";
import {CardinalDirection} from "../models/CardinalDirection";
import MainScene from "../scenes/MainScene";
import {getCookie, setCookie} from "../utils/Cookies";

export default class HighwayNetController {

    public static readonly LANE_WIDTH = 6;
    private readonly scene: Phaser.Scene;
    private readonly _highwayNetwork: HighwayTile[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        const cookie = getCookie('hn');
        if (cookie)
            this._highwayNetwork = JSON.parse(cookie);
    }

    get highwayNetwork(): HighwayTile[] {
        return this._highwayNetwork;
    }

    get highwayNetworkGraphicObjs(): Phaser.GameObjects.GameObject[] {
        const res: Phaser.GameObjects.GameObject[] = [];
        this._highwayNetwork.forEach(h => {
            if (h.graphicObj !== null)
                res.push(...h.graphicObj);
        });
        return res;
    }

    public create() {
        this.draw(); // draw highway net taken from cookies
    }

    public add(x: number, y: number, dir: CardinalDirection[]) {
        const mapTile = map0[y / MainScene.TILE_RES_PX][x / MainScene.TILE_RES_PX];
        // speed limits for cities, hills, mountains and bridges over rivers
        const road = {
            realGraphicX: x,
            realGraphicY: y,
            directions: dir,
            lanesQty: 2,
            graphicObj: [],
            terrainSpeedLimit: -1
        };
        switch (mapTile) {
            case 'E':
                road.terrainSpeedLimit = 50;
                break;
            case 'c':
                road.terrainSpeedLimit = 90
                break;
            case 'h':
                road.terrainSpeedLimit = 110;
                break;
            case 'm':
                road.terrainSpeedLimit = 80;
                break;
            default:
                road.terrainSpeedLimit = 130;
        }
        this._highwayNetwork.push(road);
    }

    public clear(x: number, y: number) {
        const toBeDeleted: number[] = [];
        this._highwayNetwork.forEach((h, index) => {
            if (h.realGraphicX === x && h.realGraphicY === y) {
                h.graphicObj.forEach(o => o.destroy());
                toBeDeleted.push(index);
            }
        });
        toBeDeleted.forEach(tbd => delete this._highwayNetwork[tbd]);
        this._saveHighwayNet();
    }

    public draw() {
        this._highwayNetwork.forEach(h => {
            if (h.graphicObj.length == 0) {
                const res = MainScene.TILE_RES_PX;
                h.directions.forEach(d => {
                    switch (d) {
                        case CardinalDirection.N:
                            h.graphicObj.push(this.scene.add.rectangle(
                                    h.realGraphicX + (res / 2),
                                    h.realGraphicY,
                                    HighwayNetController.LANE_WIDTH * h.lanesQty * 2,
                                    res / 2 + HighwayNetController.LANE_WIDTH * h.lanesQty,
                                    0x242424).setOrigin(0.5, 0),
                                this.scene.add.rectangle(h.realGraphicX + (res / 2), h.realGraphicY, 1, res / 2, 0xFFFFFF).setOrigin(0.5, 0).setDepth(10)
                            );
                            break;
                        case CardinalDirection.S:
                            h.graphicObj.push(this.scene.add.rectangle(
                                    h.realGraphicX + (res / 2),
                                    h.realGraphicY + (res / 2 - HighwayNetController.LANE_WIDTH * h.lanesQty),
                                    HighwayNetController.LANE_WIDTH * h.lanesQty * 2,
                                    res / 2 + HighwayNetController.LANE_WIDTH * h.lanesQty,
                                    0x242424).setOrigin(0.5, 0),
                                this.scene.add.rectangle(h.realGraphicX + (res / 2), h.realGraphicY + (res / 2), 1, res / 2, 0xFFFFFF).setOrigin(0.5, 0).setDepth(10)
                            );
                            break;
                        case CardinalDirection.W:
                            h.graphicObj.push(this.scene.add.rectangle(
                                    h.realGraphicX + (res / 4),
                                    h.realGraphicY + (res / 2),
                                    res / 2, HighwayNetController.LANE_WIDTH * h.lanesQty * 2, 0x242424),
                                this.scene.add.rectangle(h.realGraphicX, h.realGraphicY + (res / 2), res / 2, 1, 0xFFFFFF).setOrigin(0, 0.5).setDepth(10));
                            break;
                        case CardinalDirection.E:
                            h.graphicObj.push(this.scene.add.rectangle(
                                    h.realGraphicX + (res * 0.75),
                                    h.realGraphicY + (res / 2),
                                    res / 2, HighwayNetController.LANE_WIDTH * h.lanesQty * 2, 0x242424),
                                this.scene.add.rectangle(h.realGraphicX + (res / 2), h.realGraphicY + (res / 2), res / 2, 1, 0xFFFFFF).setOrigin(0, 0.5).setDepth(10));
                            break;
                    }
                });
            }
        });
        this._saveHighwayNet();
    }

    private _saveHighwayNet() {
        const bakedHighwayNet: HighwayTile[] = [];
        this._highwayNetwork.forEach(h => {
            const hh = JSON.parse(JSON.stringify(h)); // sorta deep clone
            hh.graphicObj = [];
            bakedHighwayNet.push(hh);
        })
        setCookie('hn', JSON.stringify(bakedHighwayNet));
    }
}
