import React, { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { MenuComponent } from "./components/MenuComponent/MenuComponent";
import { RulesComponent } from "./components/RulesComponent/RulesComponent";

const TopComponent = lazy(
  () => import("./components/TopComponent/TopComponent")
);
const GameComponent = lazy(
  () => import("./components/GameComponent/GameComponent")
);

const queryClient = new QueryClient();

class App extends React.Component {
  public render() {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="row m-2">
          <div className="col-1">
            <MenuComponent />
          </div>
          <div className="col-11">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<RulesComponent />} />
                <Route path="game" element={<GameComponent />} />
                <Route path="top" element={<TopComponent />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </QueryClientProvider>
    );
  }
}

export default App;
