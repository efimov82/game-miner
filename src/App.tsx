import './App.scss';
import {FieldComponent} from "./components/FieldComponent/FieldComponent";
import {MenuComonent} from "./components/MenuComonent/MenuComonent";
import {StatsComponent} from "./components/StatsComponent/StatsComponent";
import {useState} from "react";
import {Cell, CellTypeEnum} from "./common/cell";

function App() {
    const [state, setState] = useState({
        field: [] as Cell[][],
    });

    function newGameClick() {
        console.log('new game starting');
        const rowLength = 5;
        const cellInRow = 5;
        const mines = 3;
        const rows = Array.from(Array(rowLength).keys(), x => [])
            .map((row) => {
                const cells = Array.from(Array(cellInRow).keys(), x => new Cell(CellTypeEnum.empty));
                return [...cells];
            });
        console.log('generation mines', mines);
        let needMines = mines;
        while (needMines > 0) {
            const xPos = Math.floor(Math.random() * cellInRow);
            const yPos = Math.floor(Math.random() * rowLength);

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

    return (
        <div className="row">
            <div className="col-8">
                <FieldComponent field={state.field}/>
            </div>
            <div className="col-4">
                <MenuComonent newGameClick={newGameClick}/>
                <StatsComponent/>
            </div>
        </div>

    );
}

export default App;
