export enum CellTypeEnum {
    empty = ' ',
    mine = 'm'
}


export class Cell {
    type: CellTypeEnum;
    isOpen = false;
    minesAround = 0;
    id: string;
    debugInfo?: string;

    constructor(id: string, type: CellTypeEnum, isOpen = false) {
        this.type = type;
        this.isOpen = isOpen;
        this.minesAround = 0;
        this.id = id;
    }

    open() {
        this.isOpen = true;
    }

    setType(type: CellTypeEnum) {
        this.type = type;
    }
}
