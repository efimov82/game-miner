import React, { ReactNode } from "react";
import { CellTypeEnum } from "../../common/cell";
import {
  calculateNumbers,
  generateEmptyGameField,
  generateMines,
  getIndexesById,
  openEmptyCells
} from "../../common/functions";
import { GameState, GameStatus } from "../../types/game.types";
import { FieldComponent } from "../FieldComponent/FieldComponent";
import GameOverComponent from "../GameOverComponent/GameOverComponent";
import { StatsComponent } from "../StatsComponent/StatsComponent";
import UserWinComponent from "../UserWinComponent/UserWinComponent";

export class GameComponent extends React.Component<{}, GameState> {
  ROW_LENGTH = 20;
  CELL_LENGTH = 20;
  MINES_COUNT = 60;

  mines: Set<string> = new Set();
  markedMines: Set<string> = new Set();
  timer: number = 0;
  gameTimeSeconds = 0;

  constructor(props: {}, state: GameState) {
    super(props);
    this.state = {
      field: null,
      gameStatus: GameStatus.empty,
      gameTimeSeconds: 0,
    };

    this.onCellClick = this.onCellClick.bind(this);
    this.onCellMarked = this.onCellMarked.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.showAllMines = this.showAllMines.bind(this);
  }

  componentDidMount(): void {
    this.startNewGame();
  }

  componentWillUnmount(): void {
    clearInterval(this.timer);
  }

  public startNewGame(): void {
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

  public onCellClick(cellId: string): void {
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

  public onCellMarked(cellId: string): void {
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

  protected gameOver(): void {
    this.setState({
      gameStatus: GameStatus.userLose,
    });
    clearInterval(this.timer);
  }

  protected showAllMines(): void {
    const newField = this.state.field;
    if (!newField) {
      return;
    }

    for (const cell of this.mines) {
      const { rowIndex, cellIndex } = getIndexesById(cell);
      newField[rowIndex][cellIndex].open();
    }

    this.setState({ field: newField });
  }

  protected getPopupContent(): ReactNode {
    switch (this.state.gameStatus) {
      case GameStatus.userLose:
        return <GameOverComponent onNewGameClick={this.startNewGame} onShowAllMinesClick={this.showAllMines} />;
      case GameStatus.userWin:
        return <UserWinComponent onNewGameClick={this.startNewGame} />;
      default:
        return "";
    }
  }

  public render() {
    const popUp: ReactNode = this.getPopupContent();

    return (
      <div className="container">
        {popUp}
        <div className="row mt-2 mb-2">
          <StatsComponent
            countMines={this.mines.size}
            markedMines={this.markedMines.size}
            gameTime={this.state.gameTimeSeconds}
          />
        </div>
        <div className="row mb-3">
          <FieldComponent
            field={this.state.field}
            onCellClick={this.onCellClick}
            onCellMarked={this.onCellMarked}
          />
        </div>
        <div className="row">
          <div className="col">
            <button className="btn btn-primary" onClick={this.startNewGame}>
              Play again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
