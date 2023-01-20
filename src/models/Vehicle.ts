import Phaser from "phaser";
import HighwayTile from "./HighwayTile";
import {CardinalDirection} from "./CardinalDirection";
import VehicleController from "../ctrls/VehicleController";
import MainScene from "../scenes/MainScene";
import HighwayNetController from "../ctrls/HighwayNetController";
import Circle = Phaser.Geom.Circle;

export default abstract class Vehicle {
    protected pos: [number, number];
    protected dest: [number, number];

    public dir: CardinalDirection | null = null;
    public lane: number = 0;
    private changingLane: number = 0;

    private speed: number = 0;
    private readonly accel: number;
    private readonly maxSpeed: number;

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
        /* if (this.changingLane === 0 && this.lane > 0)
            this.changingLane--; */
        if (this.changingLane !== 0)
            this._overtake(delta);
        this._accelerate(delta, 1, 1);
        this._move(delta);
    }

    private _accelerate(delta: number, direction: number, factor: number) {
        this.speed += (delta / 1000 * this.accel * direction * factor);
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    }

    public getGraphBoundary(): Phaser.Geom.Circle {
        // this determines safety distance
        return new Circle(this.pos[0], this.pos[1], HighwayNetController.LANE_WIDTH);
    }

    public aboutToCrashInto(other: Vehicle, delta: number) {
        if (this.speed > other.speed && this.maxSpeed >= other.maxSpeed) {
            this._accelerate(delta, -1, 2);
            if (this.changingLane === 0 && this.lane <= this.getCurrentTile(this.pos).lanesQty)
                this.changingLane++;
        }
    }

    private _decideDirection(tile: HighwayTile) {
        // initial direction if starting from highway exit
        if (this.dir === null && tile.directions.length == 1) {
            this.dir = tile.directions[0];
            // adjust offset from the middle based on lanes
            this._calcLaneOffset(tile, true);
        }

        if (this.dir == null)
            throw "No direction initialized!";

        if (this.getCurrentTile(this.pos).realGraphicX == this.turnedOnTile[0]
            && this.getCurrentTile(this.pos).realGraphicY == this.turnedOnTile[1])
            return; // already turned on this tile

        // simple turn
        if (tile.directions.length == 2) {
            let targetDir = this._inferTargetDir(tile);
            if (targetDir === null)
                return;
            let turnHappens = false;
            const threshold = this._calcThresholdForTurning(targetDir, tile);
            switch (targetDir) {
                case CardinalDirection.N:
                case CardinalDirection.S:
                    if ((this.dir === CardinalDirection.W && this.pos[0] <= threshold)
                        || (this.dir === CardinalDirection.E && this.pos[0] >= threshold)) {
                        this.pos[0] = threshold;
                        turnHappens = true;
                    }
                    break;
                case CardinalDirection.E:
                case CardinalDirection.W:
                    if ((this.dir === CardinalDirection.S && this.pos[1] >= threshold)
                        || (this.dir === CardinalDirection.N && this.pos[1] <= threshold)) {
                        this.pos[1] = threshold;
                        turnHappens = true;
                    }
                    break;
                case null:
                    turnHappens = false;
            }
            if (turnHappens) {
                this.dir = targetDir;
                this.turnedOnTile = [this.getCurrentTile(this.pos).realGraphicX, this.getCurrentTile(this.pos).realGraphicY];
            }
        }
    }

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

    private _calcLaneOffset(tile: HighwayTile, apply: boolean): number {
        let offset = HighwayNetController.LANE_WIDTH * tile.lanesQty - HighwayNetController.LANE_WIDTH / 2 - (this.lane + this.changingLane) * HighwayNetController.LANE_WIDTH;
        switch (this.dir) {
            case CardinalDirection.E:
                if (apply)
                    this.pos[1] += offset;
                break;
            case CardinalDirection.W:
                if (apply)
                    this.pos[1] -= offset;
                break;
            case CardinalDirection.N:
                if (apply)
                    this.pos[0] += offset;
                break;
            case CardinalDirection.S:
                if (apply)
                    this.pos[0] -= offset;
                break;
        }
        return offset;
    }

    private _inferTargetDir(tile: HighwayTile): CardinalDirection | null {
        let targetDir;
        switch (this.dir) {
            case CardinalDirection.N:
            case CardinalDirection.S:
                if (tile.directions.includes(CardinalDirection.N) && tile.directions.includes(CardinalDirection.S))
                    return null; // no need to turn if road is straight
                targetDir = tile.directions[0] !== CardinalDirection.N && tile.directions[0] !== CardinalDirection.S
                    ? tile.directions[0] : tile.directions[1];
                break;
            case CardinalDirection.E:
            case CardinalDirection.W:
                if (tile.directions.includes(CardinalDirection.E) && tile.directions.includes(CardinalDirection.W))
                    return null; // same
                targetDir = tile.directions[0] !== CardinalDirection.E && tile.directions[0] !== CardinalDirection.W
                    ? tile.directions[0] : tile.directions[1];
        }
        return targetDir;
    }

    private _calcThresholdForTurning(targetDir: CardinalDirection, tile: HighwayTile): number {
        switch (targetDir) {
            case CardinalDirection.N:
                return this.getCurrentTile(this.pos).realGraphicX + MainScene.TILE_RES_PX / 2 + this._calcLaneOffset(tile, false);
            case CardinalDirection.S:
                return this.getCurrentTile(this.pos).realGraphicX + MainScene.TILE_RES_PX / 2 - this._calcLaneOffset(tile, false);
            case CardinalDirection.E:
                return this.getCurrentTile(this.pos).realGraphicY + MainScene.TILE_RES_PX / 2 + this._calcLaneOffset(tile, false);
            case CardinalDirection.W:
                return this.getCurrentTile(this.pos).realGraphicY + MainScene.TILE_RES_PX / 2 - this._calcLaneOffset(tile, false);
        }
    }

    public abstract getGraphObj(): Phaser.GameObjects.GameObject;

    private _overtake(delta: number) {
        // TODO refactor this mess, and this whole class tbh
        const movement = ((this.speed * 0.2778) * (delta / 1000)) / 10 * VehicleController.FAST_FORWARD_FACTOR / 2 as integer;
        if (this.dir === null)
            return;
        switch (this.dir) {
            case CardinalDirection.N:
                this.pos[0] -= movement;
                const tn = this.getCurrentTile(this.pos).realGraphicX + MainScene.TILE_RES_PX / 2 + this._calcLaneOffset(this.getCurrentTile(this.pos), false);
                if (this.pos[0] <= tn) {
                    this.pos[0] = tn;
                    this.lane += this.changingLane;
                    this.changingLane = 0;
                }
                break;
            case CardinalDirection.S:
                this.pos[0] += movement;
                const ts = this.getCurrentTile(this.pos).realGraphicX + MainScene.TILE_RES_PX / 2 - this._calcLaneOffset(this.getCurrentTile(this.pos), false);
                if (this.pos[0] >= ts) {
                    this.pos[0] = ts;
                    this.lane += this.changingLane;
                    this.changingLane = 0;
                }
                break;
            case CardinalDirection.E:
                this.pos[1] -= movement;
                const te = this.getCurrentTile(this.pos).realGraphicY + MainScene.TILE_RES_PX / 2 + this._calcLaneOffset(this.getCurrentTile(this.pos), false);
                if (this.pos[1] <= te) {
                    this.pos[1] = te;
                    this.lane += this.changingLane;
                    this.changingLane = 0;
                }
                break;
            case CardinalDirection.W:
                this.pos[1] += movement;
                const tw = this.getCurrentTile(this.pos).realGraphicY + MainScene.TILE_RES_PX / 2 - this._calcLaneOffset(this.getCurrentTile(this.pos), false);
                if (this.pos[1] >= tw) {
                    this.pos[1] = tw;
                    this.lane += this.changingLane;
                    this.changingLane = 0;
                }
        }
        // @ts-ignore
        this.getGraphObj().x = this.pos[0];
        // @ts-ignore
        this.getGraphObj().y = this.pos[1];

    }
}
