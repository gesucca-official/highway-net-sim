import {CardinalDirection} from "./CardinalDirection";

export default interface HighwayTile {
    realGraphicX: number,
    realGraphicY: number,
    directions: CardinalDirection[],
    lanesQty: number,
    graphicObj: Phaser.GameObjects.GameObject[],
    terrainSpeedLimit: number
}
