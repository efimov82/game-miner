import { Link } from "react-router-dom";

export function MenuComponent(props: {}) {
  return (
    <div className="row menu-wrapper">
      <div className="col-4 col-sm-3 m-2">
        <Link to="/">Rules</Link>
      </div>
      <div className="col-4 col-sm-3 m-2">
        <Link to="/top">TOP 20</Link>
      </div>
    </div>
  );
}
