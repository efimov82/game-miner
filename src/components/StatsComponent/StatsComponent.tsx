import "./StatsComponent.scss";
// import mine from '../../assets/images/mine.svg';

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

  /**
   * Format seconds to HH:MM:SS
   * @param seconds
   * @returns string to HH:MM:SS
   */
  function formatTime(seconds: number): string {
    const date = new Date(seconds * 1000);
    let hh = date.getUTCHours();
    let mm = date.getUTCMinutes();
    let ss = date.getSeconds();
    // If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
    // if (hh > 12) {hh = hh % 12;}
    let hours = hh.toString();
    let minutes = mm.toString();
    let secs = ss.toString();

    if (hh < 10) {
      hours = "0" + hours;
    }
    if (mm < 10) {
      minutes = "0" + minutes;
    }
    if (ss < 10) {
      secs = "0" + secs;
    }

    return `${hours}:${minutes}:${secs}`;
  }
}
