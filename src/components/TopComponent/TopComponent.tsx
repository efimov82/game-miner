import React from "react";
import { useQuery } from "react-query";

import { formatTime } from "../../common/date-time.functions";
import { fetchTop } from "../../services/game.service";
import { WinnerResult } from "../../types/game.types";

const TopComponent: React.FC = () => {
  const { status, error, data } = useQuery<WinnerResult[], Error>(
    ["top-query", { count: 20 }],
    fetchTop
  );

  if (status === "loading") {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }
  if (status === "error") {
    return <div>{error!.message}</div>;
  }

  return data ? (
    <div className="container">
      <h1>Top 20</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nickname</th>
            <th scope="col">Field size</th>
            <th scope="col">Time</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>{formatTopResults(data)}</tbody>
      </table>
    </div>
  ) : null;

  function formatTopResults(data: WinnerResult[]) {
    const content = data.map((winner, index) => {
      const date = new Date(winner.timestamp);
      const dateFormated = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

      return (
        <tr key={index}>
          <th scope="row">{index}</th>
          <td>{winner.nickName}</td>
          <td>{winner.fieldSize}</td>
          <td>{formatTime(winner.gameTime)}</td>
          <td>{dateFormated}</td>
        </tr>
      );
    });

    return content;
  }
};

export default TopComponent;