import HighwayTile from "../models/HighwayTile";
import {CardinalDirection} from "../models/CardinalDirection";

export default class HighwayNetController {

    private readonly scene: Phaser.Scene;
    private readonly _highwayNetwork: HighwayTile[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    get highwayNetwork(): HighwayTile[] {
        return this._highwayNetwork;
    }

    get highwayNetworkGraphicObjs(): Phaser.GameObjects.GameObject[] {
        const res: Phaser.GameObjects.GameObject[] = [];
        this._highwayNetwork.forEach(h => {
            if (h.graphicObj !== null)
                res.push(h.graphicObj);
        });
        return res;
    }

    public add(x: number, y: number, dir: CardinalDirection[]) {
        this._highwayNetwork.push({
            mapX: x,
            mapY: y,
            directions: dir,
            lanesQty: 2,
            graphicObj: null
        })
    }

    public draw() {
        this._highwayNetwork.forEach(h => {
            if (h.graphicObj == null)
                console.log('draw this');
        });
    }
}
