import React from "react";

import { Cell } from "../../common/cell";
import { CellComponent } from "../CellComponent/CellComponent";
import "./FieldComponent.scss";

type FieldComponentProps = {
  onCellClick: (cellId: string) => void;
  onCellMarked: (cellId: string) => void;
  field: Cell[][];
};

export class FieldComponent extends React.Component<FieldComponentProps, {}> {
  componentDidMount() {
    //document.addEventListener("click", this.handleClick);
    document.addEventListener("contextmenu", this.handleContextMenu);
  }

  componentWillUnmount() {
    //document.removeEventListener("click", this.handleClick);
    document.removeEventListener("contextmenu", this.handleContextMenu);
  }

  handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  render() {
    const fieldMap = this.props.field.map((row, rowIndex) => {
      const rowComponent = row.map((cell, cellIndex) => {
        return (
          <div className="field-cell" key={cellIndex.toString()}>
            <CellComponent
              cell={cell}
              onCellClick={this.props.onCellClick}
              onCellMarked={this.props.onCellMarked}
            />
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
        <div className="field">{fieldMap}</div>
      </div>
    );
  }
}
