import Phaser from "phaser";
import HighwayTile from "./HighwayTile";
import {CardinalDirection} from "./CardinalDirection";
import VehicleController from "../ctrls/VehicleController";
import MainScene from "../scenes/MainScene";

export default abstract class Vehicle {
    protected pos: [number, number];
    protected dest: [number, number];

    private speed: number = 0;
    private readonly accel: number;
    private readonly maxSpeed: number;

    private dir: CardinalDirection | null = null;
    private turnedOnTile: [number, number] = [0, 0];

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
        this._decideDirection(tile);

        this.speed += (delta / 1000 * this.accel);
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        this._move(delta);
    }

    private _decideDirection(tile: HighwayTile) {
        // initial direction if starting from highway exit
        if (this.dir === null && tile.directions.length == 1)
            this.dir = tile.directions[0];
        if (this.dir == null)
            throw "No direction initialized!";

        if (this.getCurrentTile(this.pos).realGraphicX == this.turnedOnTile[0]
            && this.getCurrentTile(this.pos).realGraphicY == this.turnedOnTile[1])
            return; // already turned on this tile

        // simple turn
        if (tile.directions.length == 2) {
            let targetDir;
            switch (this.dir) {
                case CardinalDirection.N:
                case CardinalDirection.S:
                    if (tile.directions.includes(CardinalDirection.N) && tile.directions.includes(CardinalDirection.S))
                        return; // no need to turn if road is straight
                    targetDir = tile.directions[0] !== CardinalDirection.N && tile.directions[0] !== CardinalDirection.S
                        ? tile.directions[0] : tile.directions[1];
                    break;
                case CardinalDirection.E:
                case CardinalDirection.W:
                    if (tile.directions.includes(CardinalDirection.E) && tile.directions.includes(CardinalDirection.E))
                        return; // same
                    targetDir = tile.directions[0] !== CardinalDirection.E && tile.directions[0] !== CardinalDirection.W
                        ? tile.directions[0] : tile.directions[1];
            }
            let turnHappens = false;
            switch (targetDir) {
                case CardinalDirection.N:
                case CardinalDirection.S:
                    const tn = this.getCurrentTile(this.pos).realGraphicX + MainScene.TILE_RES_PX / 2;
                    if (this.dir === CardinalDirection.W && this.pos[0] <= tn) {
                        this.pos[0] = tn;
                        turnHappens = true;
                    }
                    if (this.dir === CardinalDirection.E && this.pos[0] >= tn) {
                        this.pos[0] = tn;
                        turnHappens = true;
                    }
                    break;
                case CardinalDirection.E:
                case CardinalDirection.W:
                    const te = this.getCurrentTile(this.pos).realGraphicY + MainScene.TILE_RES_PX / 2;
                    if (this.dir === CardinalDirection.S && this.pos[1] >= te) {
                        this.pos[1] = te;
                        turnHappens = true;
                    }
                    if (this.dir === CardinalDirection.N && this.pos[1] <= te) {
                        this.pos[1] = te;
                        turnHappens = true;
                    }
                    break;
            }
            if (turnHappens) {
                this.dir = targetDir;
                this.turnedOnTile = [this.getCurrentTile(this.pos).realGraphicX, this.getCurrentTile(this.pos).realGraphicY];
            }
        }
    }

    public abstract getGraphObj(): Phaser.GameObjects.GameObject;

    private _move(delta) {
        const movement = ((this.speed * 0.2778) * (delta / 1000)) / 10 * VehicleController.FAST_FORWARD_FACTOR as integer;
        switch (this.dir) {
            case CardinalDirection.N:
                this.pos[1] -= movement;
                break;
            case CardinalDirection.S:
                this.pos[1] += movement;
                break;
            case CardinalDirection.E:
                this.pos[0] += movement;
                break;
            case CardinalDirection.W:
                this.pos[0] -= movement;
        }
        // @ts-ignore
        this.getGraphObj().x = this.pos[0];
        // @ts-ignore
        this.getGraphObj().y = this.pos[1];
    }

}
