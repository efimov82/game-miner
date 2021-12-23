import React, { ReactNode } from "react";

import "./App.scss";
import { Cell, CellTypeEnum } from "./common/cell";
import { FieldComponent } from "./components/FieldComponent/FieldComponent";
import GameOverComponent from "./components/GameOverComponent/GameOverComponent";
import { MenuComonent } from "./components/MenuComonent/MenuComonent";
import { StatsComponent } from "./components/StatsComponent/StatsComponent";
import UserWinComponent from "./components/UserWinComponent/UserWinComponent";

type AppProps = {};

type AppState = {
  field: Cell[][] | null;
  gameStatus: GameStatus;
  gameTimeSeconds: number;
};

enum GameStatus {
  empty = "empty",
  open = "open",
  userWin = "win",
  userLose = "lose",
}

class App extends React.Component<AppProps, AppState> {
  ROW_LENGTH = 10;
  CELL_LENGTH = 10;
  MINES_COUNT = 5;

  mines: Set<string> = new Set();
  markedMines: Set<string> = new Set();
  timer: any;
  gameTimeSeconds = 0;

  constructor(props: AppProps, state: AppState) {
    super(props);
    this.state = {
      field: null,
      gameStatus: GameStatus.empty,
      gameTimeSeconds: 0,
    };

    this.newGameClick = this.newGameClick.bind(this);
    this.openEmptyFields = this.openEmptyFields.bind(this);
    this.getIndexesById = this.getIndexesById.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onCellMarked = this.onCellMarked.bind(this);
  }

  public newGameClick() {
    const field = this.generateEmptyGameField(
      this.ROW_LENGTH,
      this.CELL_LENGTH
    );
    this.generateMines(field, this.MINES_COUNT);
    this.calculateNumbers(field);
    this.markedMines = new Set();

    this.setState({
      field,
      gameStatus: GameStatus.open,
      gameTimeSeconds: 0,
    });

    clearInterval(this.timer);
    this.setState({ gameTimeSeconds: 0 });
    this.timer = setInterval(() => {
      this.setState({ gameTimeSeconds: this.state.gameTimeSeconds + 1 });
    }, 1000);
  }

  public onCellClick(cellId: string) {
    if (this.state.gameStatus !== GameStatus.open) {
      return;
    }

    const { rowIndex, cellIndex } = this.getIndexesById(cellId);
    const newFields = this.state.field;

    if (
      newFields === null ||
      newFields[rowIndex][cellIndex].isOpen ||
      newFields[rowIndex][cellIndex].isMarked
    ) {
      return;
    }

    switch (newFields[rowIndex][cellIndex].type) {
      case CellTypeEnum.empty:
        if (newFields[rowIndex][cellIndex].minesAround === 0) {
          this.openEmptyFields(newFields, rowIndex, cellIndex);
        }
        break;
      case CellTypeEnum.mine:
        this.gameOver();
    }

    newFields[rowIndex][cellIndex].open();
    this.setState({ field: newFields });
  }

  public onCellMarked(cellId: string) {
    if (this.state.gameStatus !== GameStatus.open) {
      return;
    }

    const indexes = this.getIndexesById(cellId);
    const { rowIndex, cellIndex } = indexes;
    const newFields = this.state.field;

    if (newFields === null) {
      return;
    }

    const cell = newFields[rowIndex][cellIndex];

    if (cell.isOpen) {
      return;
    }

    const index = `${rowIndex}_${cellIndex}`;
    if (!cell.isMarked) {
      this.markedMines.add(index);
    } else {
      this.markedMines.delete(index);
    }

    newFields[rowIndex][cellIndex].setMarked(!cell.isMarked);
    this.setState({ field: newFields });
    if (this.checkAllMinesMarked()) {
      this.setState({
        gameStatus: GameStatus.userWin,
      });
      clearInterval(this.timer);
    }
  }

  protected generateEmptyGameField(
    rowsCount: number,
    cellsCount: number
  ): Cell[][] {
    return Array.from(Array(rowsCount).keys(), (x) => []).map((_, rowIndex) => {
      const cells = Array.from(
        Array(cellsCount).keys(),
        (x, cellIndex) =>
          new Cell(`${rowIndex}_${cellIndex}`, CellTypeEnum.empty)
      );
      return [...cells];
    });
  }

  protected generateMines(field: Cell[][], countMines: number): void {
    this.mines = new Set();

    while (countMines > 0) {
      const xPos = Math.floor(Math.random() * this.CELL_LENGTH);
      const yPos = Math.floor(Math.random() * this.ROW_LENGTH);

      if (field[yPos][xPos].type === CellTypeEnum.empty) {
        field[yPos][xPos].setType(CellTypeEnum.mine);
        const index = `${yPos}_${xPos}`;
        this.mines.add(index);
        countMines -= 1;
      }
    }
  }

  protected calculateNumbers(field: Cell[][]): void {
    for (let rowIndex = 0; rowIndex < field.length; rowIndex++) {
      for (let cellIndex = 0; cellIndex < field[rowIndex].length; cellIndex++) {
        if (field[rowIndex][cellIndex].type === CellTypeEnum.mine) {
          continue;
        }

        const startRowIndex = rowIndex - 1 >= 0 ? rowIndex - 1 : 0;
        const startCellIndex = cellIndex - 1 >= 0 ? cellIndex - 1 : 0;
        const endRowIndex =
          rowIndex + 1 < field.length ? rowIndex + 1 : field.length - 1;
        const endCellIndex =
          cellIndex + 1 < field[rowIndex].length
            ? cellIndex + 1
            : field[rowIndex].length - 1;

        let minesAround = 0;
        for (let y = startRowIndex; y <= endRowIndex; y += 1) {
          for (let x = startCellIndex; x <= endCellIndex; x += 1) {
            if (field[y][x].type === CellTypeEnum.mine) {
              minesAround += 1;
            }
          }
        }

        field[rowIndex][cellIndex].minesAround = minesAround;
      }
    }
  }

  protected openEmptyFields(
    fields: Cell[][],
    rowIndex: number,
    cellIndex: number
  ) {
    const startRowIndex = rowIndex - 1 > 0 ? rowIndex - 1 : 0;
    const endRowIndex =
      rowIndex + 1 < this.ROW_LENGTH - 1 ? rowIndex + 1 : this.ROW_LENGTH - 1;

    const startCellIndex = cellIndex - 1 > 0 ? cellIndex - 1 : 0;
    const endCellIndex =
      cellIndex + 1 < this.CELL_LENGTH - 1
        ? cellIndex + 1
        : this.CELL_LENGTH - 1;

    for (let rIndex = startRowIndex; rIndex <= endRowIndex; rIndex += 1) {
      for (let cIndex = startCellIndex; cIndex <= endCellIndex; cIndex += 1) {
        fields[rIndex][cIndex].debugInfo = "checked";
        if (
          !fields[rIndex][cIndex].isOpen &&
          fields[rIndex][cIndex].type === CellTypeEnum.empty &&
          fields[rIndex][cIndex].minesAround === 0
        ) {
          fields[rIndex][cIndex].open();
          this.openEmptyFields(fields, rIndex, cIndex);
        }
      }
    }
  }

  protected checkAllMinesMarked(): boolean {
    for (const cell of this.mines) {
      if (!this.markedMines.has(cell)) {
        return false;
      }
    }

    return true;
  }

  protected getIndexesById(id: string): {
    rowIndex: number;
    cellIndex: number;
  } {
    const split = id.split("_");
    if (split.length !== 2) {
      const err = new Error(`Cant get index of ${id}`);
      throw err;
    }

    return {
      rowIndex: +split[0],
      cellIndex: +split[1],
    };
  }

  protected gameOver() {
    this.setState({
      gameStatus: GameStatus.userLose,
    });
    clearInterval(this.timer);
  }

  public render() {
    let gameField: ReactNode = null;
    let popUp: ReactNode = null;

    if (this.state.field) {
      gameField = (
        <FieldComponent
          field={this.state.field}
          onCellClick={this.onCellClick}
          onCellMarked={this.onCellMarked}
        />
      );
    }

    switch (this.state.gameStatus) {
      case GameStatus.userLose:
        popUp = <GameOverComponent />;
        break;
      case GameStatus.userWin:
        popUp = <UserWinComponent />;
        break;
      default:
      //
    }

    return (
      <>
        {popUp}
        <div className="row">
          <div className="col-8">{gameField}</div>
          <div className="col-4">
            <MenuComonent newGameClick={this.newGameClick} />
            <StatsComponent
              countMines={this.mines.size}
              markedMines={this.markedMines.size}
              gameTime={this.state.gameTimeSeconds}
            />
          </div>
        </div>
      </>
    );
  }
}

export default App;
