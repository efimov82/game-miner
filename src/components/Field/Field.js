import './Field.scss';
import { Cell } from "../Cell/Cell";

export function Field({ field }) {
    const mineMap = field.map((row) => {
        const rowComponent = row.map((cell) => {
            return (
                <div className="field-cell">
                    <Cell value={cell} />
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
        <div className="field">
            {mineMap}
        </div>
    );
}
