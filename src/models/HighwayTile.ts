import {CardinalDirection} from "./CardinalDirection";

export default interface HighwayTile {
    mapX: number,
    mapY: number,
    directions: CardinalDirection[];
    lanesQty: number
    graphicObj: Phaser.GameObjects.GameObject | null
}
