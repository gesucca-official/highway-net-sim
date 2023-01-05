import Phaser from "phaser";
import {map0} from "../maps/map0"

export default class MainScene extends Phaser.Scene {


    constructor() {
        super('main-scenes');
    }

    preload(): void {
    }

    create(): void {
        console.log(map0)
        /*
        this.cameras.main.setBounds(0, 0, 2560, 1440);
        this.physics.world.setBounds(0, 0, 2560, 1440);
        this.cameras.main.startFollow(this.player.getReference(), true, 0.5, 0.5)
         */
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}
