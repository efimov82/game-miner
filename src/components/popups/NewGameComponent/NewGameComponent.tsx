import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { DifficultyLevel, GameSettings } from "../../../types/game.types";

type NewGameComponentProps = {
  onNewGameClick: (settings: GameSettings) => void;
  onNewGameModalClose: () => void;
};

type NewGameComponentState = {
  show: boolean;
  gameSettings: GameSettings;
};

export class NewGameComponent extends React.Component<
  NewGameComponentProps,
  NewGameComponentState
> {
  // const [show, setShow] = useState(true);
  // const [gameSettings, setGameSettings] = useState<GameSettings>({

  constructor(props: NewGameComponentProps, state: NewGameComponentState) {
    super(props);
    this.state = {
      show: true,
      gameSettings: {
        rows: 10,
        cells: 10,
        difficultyLevel: DifficultyLevel.low,
      },
    };

    console.log("NewGameComponent", props);
  }

  //handleClose = () => this.setState({ show: false });
  handleClose = () => this.props.onNewGameModalClose();

  componentWillUnmount() {
    console.log('unmount NewGameComponent');
  }

  handleChangeLevel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let level: DifficultyLevel;

    switch (value) {
      case "low":
        level = DifficultyLevel.low;
        break;
      case "medium":
        level = DifficultyLevel.medium;
        break;
      case "high":
        level = DifficultyLevel.high;
        break;
      case "hardcore":
        level = DifficultyLevel.hardcore;
        break;
      default:
        throw new Error("Wrong DifficultyLevel value");
    }

    let settings = this.state.gameSettings;
    settings.difficultyLevel = level;
    this.setState({ gameSettings: settings });
  };

  handleFieldSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value.split("x");

    let settings = this.state.gameSettings;
    settings.rows = Number(value[0]);
    settings.cells = Number(value[1]);

    this.setState({ gameSettings: settings });
  };

  render() {
    return (
      <>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create new game</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Field size:{" "}
              <select
                name="fieldSize"
                onChange={(e) => this.handleFieldSizeChange(e)}
              >
                <option value="10x10">10x10</option>
                <option value="15x15">15x15</option>
                <option value="20x20">20x20</option>
                <option value="25x25">25x25</option>
                <option value="30x30">30x30</option>
                <option value="40x40">40x40</option>
              </select>
            </p>
            <p>
              Difficulty:{" "}
              <select
                name="fieldSize"
                onChange={(e) => this.handleChangeLevel(e)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="hardcore">Hardcore</option>
              </select>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => this.props.onNewGameClick(this.state.gameSettings)}
            >
              Start
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
