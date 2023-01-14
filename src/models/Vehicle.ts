import Phaser from "phaser";

export default abstract class Vehicle {
    protected pos: [number, number];
    protected dest: [number, number];
    public readonly accel: number;
    public readonly maxSpeed: number;
    protected constructor(start: [number, number], dest: [number, number],
                          accel: number, maxSpeed: number) {
        this.pos = start;
        this.dest = dest;
        this.accel = accel;
        this.maxSpeed = maxSpeed;
    }

    public update(time: number, delta: number) {
    }

    public abstract getGraphObj(): Phaser.GameObjects.GameObject;

    private _findPath() {

    }
}