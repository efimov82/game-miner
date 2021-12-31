import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { GameComponent } from "./components/GameComponent/GameComponent";
import { MenuComponent } from "./components/MenuComponent/MenuComponent";
import { RulesComponent } from "./components/RulesComponent/RulesComponent";
import { TopComponent } from "./components/TopComponent/TopComponent";

const queryClient = new QueryClient()

class App extends React.Component {
  public render() {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="row m-2">
          <div className="col-1">
            <MenuComponent />
          </div>
          <div className="col-11">
            <Routes>
              <Route path="/" element={<RulesComponent />} />
              <Route path="game" element={<GameComponent />} />
              <Route path="top" element={<TopComponent />} />
            </Routes>
          </div>
        </div>
      </QueryClientProvider>
    );
  }
}

export default App;
