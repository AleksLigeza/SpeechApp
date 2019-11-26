import { GameTile } from "./GameTile";

export class MovingTile extends GameTile {
    constructor(value, futureValue, pos, futurePos) {
        super(value);
        this.futureValue = futureValue;
        this.pos = pos;
        this.futurePos = futurePos;
    }
}