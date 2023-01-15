import Vehicle from "./Vehicle";
import Phaser from "phaser";
import HighwayTile from "./HighwayTile";

export default class IdealCarDriver extends Vehicle {

    private readonly obj: Phaser.GameObjects.GameObject;

    constructor(start: [number, number], dest: [number, number],
                getCurrentTile: (pos: [number, number]) => HighwayTile,
                scene: Phaser.Scene) {
        super(start, dest, getCurrentTile, 10, 130);
        this.obj = scene.add.circle(start[0], start[1], 5, 0x101099);
    }

    getGraphObj(): Phaser.GameObjects.GameObject {
        return this.obj;
    }

}
