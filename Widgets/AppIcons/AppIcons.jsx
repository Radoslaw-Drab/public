import { run } from "uebersicht";
import { apps } from "./src/config.js";

export const init = () => apps;
export const command = () => apps;

export const refreshFrequency = false;
import style from "./src/style.js";
export const className = style;

export const render = ({ output: apps }) => {
  const buttons = apps.map((app, i) => (
    <button
      className="btn app-btn"
      key={i}
      onClick={() => run(app.command())}
      style={{ ...app.style }}
    >
      {app.icon() && app.showIcon() && (
        <img
          className="icon"
          src={
            app.icon().includes("http")
              ? app.icon()
              : "AppIcons/src/icons/" + app.icon()
          }
        />
      )}
      {(app.showName() || (!app.showIcon() && !app.showName())) && (
        <p className="text">{app.displayName()}</p>
      )}
    </button>
  ));
  return <div className="container">{buttons}</div>;
};
