import { Cell, CellTypeEnum } from "../../common/cell";
import "./CellComponent.scss";

type CellComponentProps = {
  cell: Cell;
  onCellClick: (i: string) => void;
  onCellMarked: (i: string) => void;
};

export function CellComponent({
  cell,
  onCellClick,
  onCellMarked,
}: CellComponentProps) {
  function getCellClass(cell: Cell): string {
    if (cell.isMarked) {
      return "marked";
    }

    if (!cell.isOpen) {
      return "close";
    }

    if (cell.minesAround > 0) {
      return "number";
    }

    switch (cell.type) {
      case CellTypeEnum.empty:
        return "empty";
      case CellTypeEnum.mine:
        return "mine";
      default:
        return "";
    }
  }

  function getCellValue(value: Cell): string {
    if (value.isOpen && value.minesAround > 0) {
      return value.minesAround.toString();
    }

    return "";
  }

  function cellLeftClick() {
    onCellClick(cell.id);
  }

  function cellRightClick() {
    onCellMarked(cell.id);
  }

  return (
    <div
      onClick={cellLeftClick}
      onContextMenu={cellRightClick}
      key={cell.id}
      className={`cell-wrapper ${getCellClass(cell)}`}
    >
      {/*<span style={{fontSize: "9px", padding: "10px"}}>{ props.cell.debugInfo }</span>*/}
      {getCellValue(cell)}
    </div>
  );
}
