import Phaser from "phaser";
import HighwayTile from "./HighwayTile";
import {CardinalDirection} from "./CardinalDirection";
import VehicleController from "../ctrls/VehicleController";

export default abstract class Vehicle {
    protected pos: [number, number];
    protected dest: [number, number];

    private speed: number = 0;
    private readonly accel: number;
    private readonly maxSpeed: number;

    private dir: CardinalDirection | null = null;

    private readonly getCurrentTile: (pos: [number, number]) => HighwayTile;

    protected constructor(start: [number, number], dest: [number, number],
                          getCurrentTile: (pos: [number, number]) => HighwayTile,
                          accel: number, maxSpeed: number) {
        this.pos = start;
        this.dest = dest;
        this.accel = accel;
        this.maxSpeed = maxSpeed;
        this.getCurrentTile = getCurrentTile;
    }

    public update(time: number, delta: number) {
        const tile = this.getCurrentTile(this.pos);
        // initial direction if starting from highway exit
        if (this.dir === null && this.getCurrentTile(this.pos).directions.length == 1)
            this.dir = tile.directions[0];

        this.speed += (delta / 1000 * this.accel);
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        this._move(delta);
    }

    public abstract getGraphObj(): Phaser.GameObjects.GameObject;

    private _move(delta) {
        switch (this.dir) {
            case CardinalDirection.E:
                this.pos[0] += ((this.speed * 0.2778) * (delta / 1000)) / 10 * VehicleController.FAST_FORWARD_FACTOR as integer;
        }
        // @ts-ignore
        this.getGraphObj().x = this.pos[0];
        // @ts-ignore
        this.getGraphObj().y = this.pos[1];
    }

}
