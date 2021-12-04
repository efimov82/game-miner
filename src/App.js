import './App.scss';
import {Field} from "./components/Field/Field";
import {Menu} from "./components/Menu/Menu";
import {Stats} from "./components/Stats/Stats";
import {useState} from "react";

const MINE_CHAR = 'm';
const EMPTY_CELL = ' ';

function App() {
    const [state, setState] = useState({
        field: [],
    });

    function newGameClick() {
        console.log('new game starting');
        const rowLength = 5;
        const cellInRow = 5;
        const mines = 3;
        const rows = Array.from(Array(rowLength).keys(), x => [])
            .map((row) => {
                const cells = Array.from(Array(cellInRow).keys(), x => EMPTY_CELL);
                return [...cells];
            });
        console.log('generation mines', mines);
        let needMines = mines;
        while (needMines > 0) {
            const xPos = Math.floor(Math.random() * cellInRow);
            const yPos = Math.floor(Math.random() * rowLength);

            if (rows[yPos][xPos] === EMPTY_CELL) {
                rows[yPos][xPos] = MINE_CHAR;
                needMines -= 1;
            }
        }

        console.log('generating numbers');
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
            for (let cellIndex = 0; cellIndex < rows[rowIndex].length; cellIndex += 1) {
                if (rows[rowIndex][cellIndex] !== MINE_CHAR) {
                    const startRowIndex = rowIndex - 1 >= 0 ? rowIndex - 1 : 0;
                    const startCellIndex = cellIndex - 1 >= 0 ? cellIndex - 1 : 0;
                    const endRowIndex = rowIndex + 1 < rows.length ? rowIndex + 1 : rows.length - 1;
                    const endCellIndex = cellIndex + 1 < rows[rowIndex].length ? cellIndex + 1 : rows[rowIndex].length - 1;

                    let minesAround = 0;
                    for (let y = startRowIndex; y <= endRowIndex; y += 1) {
                        for (let x = startCellIndex; x <= endCellIndex; x += 1) {
                            if (rows[y][x] === MINE_CHAR) {
                                minesAround += 1;
                            }
                        }
                    }

                    rows[rowIndex][cellIndex] = minesAround;

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
                <Field class="field-component" field={state.field}/>
            </div>
            <div className="col-4">
                <Menu newGameClick={newGameClick}/>
                <Stats/>
            </div>
        </div>

    );
}

export default App;
