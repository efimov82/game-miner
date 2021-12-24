import React, { ReactNode } from "react";
import "./App.scss";
import { Cell, CellTypeEnum } from "./common/cell";
import {
  calculateNumbers, generateEmptyGameField,
  generateMines,
  getIndexesById,
  openEmptyCells
} from "./common/functions";
import { FieldComponent } from "./components/FieldComponent/FieldComponent";
import GameOverComponent from "./components/GameOverComponent/GameOverComponent";
import { MenuComonent } from "./components/MenuComonent/MenuComonent";
import { RulesComponent } from "./components/RulesComponent/RulesComponent";
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
  ROW_LENGTH = 20;
  CELL_LENGTH = 20;
  MINES_COUNT = 60;

  mines: Set<string> = new Set();
  markedMines: Set<string> = new Set();
  timer: number = 0;
  gameTimeSeconds = 0;

  constructor(props: AppProps, state: AppState) {
    super(props);
    this.state = {
      field: null,
      gameStatus: GameStatus.empty,
      gameTimeSeconds: 0,
    };

    this.newGameClick = this.newGameClick.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onCellMarked = this.onCellMarked.bind(this);
  }

  public newGameClick() {
    const field = generateEmptyGameField(this.ROW_LENGTH, this.CELL_LENGTH);
    this.mines = generateMines(field, this.MINES_COUNT);
    calculateNumbers(field);
    this.markedMines = new Set();

    this.setState({
      field,
      gameStatus: GameStatus.open,
      gameTimeSeconds: 0,
    });

    clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      this.setState({ gameTimeSeconds: this.state.gameTimeSeconds + 1 });
    }, 1000);
  }

  public onCellClick(cellId: string) {
    if (this.state.gameStatus !== GameStatus.open) {
      return;
    }

    const { rowIndex, cellIndex } = getIndexesById(cellId);
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
          openEmptyCells(newFields, rowIndex, cellIndex);
        }
        break;
      case CellTypeEnum.mine:
        this.gameOver();
    }

    newFields[rowIndex][cellIndex].open();
    this.setState({ field: newFields });
  }

  public onCellMarked(cellId: string) {
    if (this.state.gameStatus !== GameStatus.open || !this.state.field) {
      return;
    }

    const { rowIndex, cellIndex } = getIndexesById(cellId);
    const newFields = this.state.field;
    const cell = newFields[rowIndex][cellIndex];

    if (cell.isOpen) {
      return;
    }

    if (!cell.isMarked) {
      this.markedMines.add(cellId);
    } else {
      this.markedMines.delete(cellId);
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

  protected checkAllMinesMarked(): boolean {
    for (const cell of this.mines) {
      if (!this.markedMines.has(cell)) {
        return false;
      }
    }

    return true;
  }

  protected gameOver() {
    this.setState({
      gameStatus: GameStatus.userLose,
    });
    clearInterval(this.timer);
  }

  protected getPopupContent(): ReactNode {
    switch (this.state.gameStatus) {
      case GameStatus.userLose:
        return <GameOverComponent />;
      case GameStatus.userWin:
        return <UserWinComponent />;
      default:
        return "";
    }
  }

  protected getGameFieldContent(): ReactNode {
    if (this.state.field) {
      return (
        <FieldComponent
          field={this.state.field}
          onCellClick={this.onCellClick}
          onCellMarked={this.onCellMarked}
        />
      );
    } else {
      return <RulesComponent />;
    }
  }

  public render() {
    const gameField: ReactNode = this.getGameFieldContent();
    const popUp: ReactNode = this.getPopupContent();

    return (
      <>
        {popUp}
        <div className="row m-2">
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
