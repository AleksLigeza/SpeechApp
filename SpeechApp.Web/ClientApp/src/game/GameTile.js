export class GameTile { 
    value = 0;
    isMerged = false;

    constructor(value) {
        this.value = value;
    }

    setMerged() {
        this.isMerged = true;
    }
}