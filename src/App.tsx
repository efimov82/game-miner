import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { GameComponent } from "./components/GameComponent/GameComponent";
import { MenuComonent } from "./components/MenuComonent/MenuComonent";
import { RulesComponent } from "./components/RulesComponent/RulesComponent";
import { TopComponent } from "./components/TopComponent/TopComponent";

class App extends React.Component {
  public render() {
    return (
      <>
        <div className="row m-2">
          <div className="col-2">
            <MenuComonent />
          </div>
          <div className="col-10">
            <Routes>
              <Route path="/" element={<RulesComponent />} />
              <Route path="game" element={<GameComponent />} />
              <Route path="top" element={<TopComponent />} />
            </Routes>
          </div>
        </div>
      </>
    );
  }
}

export default App;
