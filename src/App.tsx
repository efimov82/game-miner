import './App.scss';
import { FieldComponent } from './components/FieldComponent/FieldComponent';
import { MenuComonent } from './components/MenuComonent/MenuComonent';
import { StatsComponent } from './components/StatsComponent/StatsComponent';
import { useState } from 'react';
import { Cell, CellTypeEnum } from './common/cell';

function App() {
    const ROW_LENGTH = 5;
    const CELL_LENGTH = 5;
    const MINES_COUNT = 3;

    const [ state, setState ] = useState({
        field: [] as Cell[][],
    });

    function newGameClick() {
        console.log('new game starting');
        const rows = Array.from(Array(ROW_LENGTH).keys(), x => [])
            .map((row, rowIndex) => {
                const cells = Array.from(Array(CELL_LENGTH).keys(),
                  (x, cellIndex) => new Cell(`${rowIndex}_${cellIndex}`, CellTypeEnum.empty));
                return [...cells];
            });
        console.log('generation mines', MINES_COUNT);
        let needMines = MINES_COUNT;
        while (needMines > 0) {
            const xPos = Math.floor(Math.random() * CELL_LENGTH);
            const yPos = Math.floor(Math.random() * ROW_LENGTH);

            if (rows[yPos][xPos].type === CellTypeEnum.empty) {
                rows[yPos][xPos].setType(CellTypeEnum.mine);
                needMines -= 1;
            }
        }

        console.log('generating numbers');
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
            for (let cellIndex = 0; cellIndex < rows[rowIndex].length; cellIndex += 1) {
                if (rows[rowIndex][cellIndex].type !== CellTypeEnum.mine) {
                    const startRowIndex = rowIndex - 1 >= 0 ? rowIndex - 1 : 0;
                    const startCellIndex = cellIndex - 1 >= 0 ? cellIndex - 1 : 0;
                    const endRowIndex = rowIndex + 1 < rows.length ? rowIndex + 1 : rows.length - 1;
                    const endCellIndex = cellIndex + 1 < rows[rowIndex].length ? cellIndex + 1 : rows[rowIndex].length - 1;

                    let minesAround = 0;
                    for (let y = startRowIndex; y <= endRowIndex; y += 1) {
                        for (let x = startCellIndex; x <= endCellIndex; x += 1) {
                            if (rows[y][x].type === CellTypeEnum.mine) {
                                minesAround += 1;
                            }
                        }
                    }

                    rows[rowIndex][cellIndex].minesAround = minesAround;

                }
            }
        }

        console.log('field', rows);

        setState({
            field: rows,
        });
    }

    function openEmptyFields(fields: Cell[][], { rowIndex, cellIndex }: {rowIndex: number; cellIndex: number}) {
        const startRowIndex = rowIndex - 1 > 0 ? rowIndex - 1 : 0;
        const endRowIndex = rowIndex + 1 < ROW_LENGTH - 1 ? rowIndex + 1  : ROW_LENGTH - 1;

        const startCellIndex = cellIndex - 1 > 0 ? cellIndex - 1 : 0;
        const endCellIndex = cellIndex + 1 < CELL_LENGTH - 1 ? cellIndex + 1  : CELL_LENGTH - 1;

        for (let rIndex = startRowIndex; rIndex <= endRowIndex; rIndex += 1) {
            for (let cIndex = startCellIndex; cIndex <= endCellIndex; cIndex += 1) {
                fields[rIndex][cIndex].debugInfo = 'checked';
                if (!fields[rIndex][cIndex].isOpen
                  && (
                    fields[rIndex][cIndex].type === CellTypeEnum.empty
                    &&  fields[rIndex][cIndex].minesAround === 0
                  )
                ) {
                    fields[rIndex][cIndex].open();
                    openEmptyFields(fields, { rowIndex: rIndex, cellIndex: cIndex });
                }
            }
        }
    }

    function onCellClick(cellId: any) {
        const indexes = getIndexesById(cellId);
        const newFields = state.field;
        if (!newFields[indexes.rowIndex][indexes.cellIndex].isOpen) {
            switch (newFields[indexes.rowIndex][indexes.cellIndex].type) {
                case CellTypeEnum.empty:
                    if (newFields[indexes.rowIndex][indexes.cellIndex].minesAround === 0) {
                        openEmptyFields(newFields, indexes);
                    }

                    break;
            }

            newFields[indexes.rowIndex][indexes.cellIndex].open();
            setState({ field: newFields });
        }
    }

    function getIndexesById(id: string): {rowIndex: number, cellIndex: number} {
        const split = id.split('_');
        if (split.length !== 2) {
            throw `Cant get index of ${id}`;
        }

        return {
            rowIndex: +split[0],
            cellIndex: +split[1],
        }
    }

    return (
        <div className="row">
            <div className="col-8">
                <FieldComponent field={state.field} onCellClick={onCellClick}/>
            </div>
            <div className="col-4">
                <MenuComonent newGameClick={newGameClick}/>
                <StatsComponent/>
            </div>
        </div>

    );
}

export default App;
