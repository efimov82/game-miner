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
      <div className="col-2 d-flex">
        <span className="mineImage" />
        <span className="">
          X <strong>{props.countMines}</strong>
        </span>
      </div>
      <div className="col-2 d-flex">
        <span className="markedMinesImage"></span>
        <span className="">
          X <strong>{props.markedMines}</strong>
        </span>
      </div>
      <div className="col-4 d-flex">
        <span className="">
          Time: <strong>{formatTime(props.gameTime)}</strong>
        </span>
      </div>
    </div>
  );
}
