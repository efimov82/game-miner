import './FieldComponent.scss';
import {CellComponent} from "../CellComponent/CellComponent";
import {Cell} from "../../common/cell";

export function FieldComponent({onCellClick, field}: {onCellClick: any, field: Cell[][] }) {
    const mineMap = field.map((row, rowIndex) => {
        const rowComponent = row.map((cell, cellIndex) => {
            return (
                <div className="field-cell" key={cellIndex.toString()}>
                    <CellComponent cell={cell} onCellClick={ onCellClick }/>
                </div>
            );
        });

        return (
            <div key={rowIndex.toString()} className="filed-row">
                {rowComponent}
            </div>
        );
    });

    return (
        <div className="field-component">
            <div className="field">
                {mineMap}
            </div>
        </div>
    );
}
