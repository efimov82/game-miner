import { formatTime } from "../../common/date-time.functions";
import "./StatsComponent.scss";

type StatsProps = {
  countMines: number;
  markedMines: number;
  gameTime: number;
};

export function StatsComponent(props: StatsProps) {
  return (
    <div className="row m-10">
      <div className="col-4 col-sm-2 d-flex">
        <span className="mineImage" />
        <span className="">
          X <strong>{props.countMines}</strong>
        </span>
      </div>
      <div className="col-4 col-sm-2 d-flex">
        <span className="markedMinesImage"></span>
        <span className="">
          X <strong>{props.markedMines}</strong>
        </span>
      </div>
      <div className="col-4 col-sm-2 d-flex">
        <span className="d-none d-sm-block">Time: </span>
        <strong>{formatTime(props.gameTime)}</strong>
      </div>
    </div>
  );
}
