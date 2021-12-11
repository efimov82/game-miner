import './CellComponent.scss';
import {Cell, CellTypeEnum} from "../../common/cell";
import useForceUpdate from 'use-force-update';

export function CellComponent(props: { value: Cell}) {
    const forceUpdate = useForceUpdate();


    function getCellClass(value: Cell) {
        if (!value.isOpen) {
            return 'close';
        }

        return value.type === CellTypeEnum.empty
            ? 'empty'
            : value.type === CellTypeEnum.mine
                ? 'mine'
                : value.minesAround === 0 ? '' :  'number';
    }

    function getCellValue(value: Cell): string {
        if (!value.isOpen) {
            return '';
        }

        if (value.minesAround > 0) {
            return value.minesAround.toString();
        }

        return value.type === CellTypeEnum.empty ? ' ' : 'm';
    }

    function cellLeftClick() {
        props.value.open();
        forceUpdate();
    }

    return (
        <div
            onClick={cellLeftClick}
            className={`cell-wrapper ${getCellClass(props.value)}`}>{ getCellValue(props.value)}</div>
    );
}
