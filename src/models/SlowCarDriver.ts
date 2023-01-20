import Vehicle from "./Vehicle";
import Phaser from "phaser";
import HighwayTile from "./HighwayTile";
import HighwayNetController from "../ctrls/HighwayNetController";

export default class SlowCarDriver extends Vehicle {

    private readonly obj: Phaser.GameObjects.GameObject;

    constructor(start: [number, number], dest: [number, number],
                getCurrentTile: (pos: [number, number]) => HighwayTile,
                scene: Phaser.Scene) {
        super(start, dest, getCurrentTile, 5, 90);
        this.obj = scene.add.circle(start[0], start[1], HighwayNetController.LANE_WIDTH / 2, 0x9090FF)
            .setDepth(100);
    }

    getGraphObj(): Phaser.GameObjects.GameObject {
        return this.obj;
    }

}
