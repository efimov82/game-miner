import './FieldComponent.scss';
import {CellComponent} from "../CellComponent/CellComponent";
import {Cell} from "../../common/cell";

export function FieldComponent({field}: { field: Cell[][] }) {
    const mineMap = field.map((row) => {
        const rowComponent = row.map((cell) => {
            return (
                <div className="field-cell">
                    <CellComponent value={cell}/>
                </div>
            );
        });

        return (
            <div className="filed-row">
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
