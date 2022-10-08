import { style } from "./config";

const scale = style.scale > 0 ? style.scale.toString() : "1";
const fontScale = style.fontScale > 0 ? style.fontScale.toString() : "1";
const iconScale = style.iconScale > 0 ? style.iconScale.toString() : "1";

export default {
  "--text-color": style.text.color || "#800C9D",
  "--text-color__hover": style.color.hover || "#291375",
  "--text-font-family": style.text.family || "sans-serif",
  "--text-letter-spacing": style.text.letterSpacing || "1px",
  "--color__1": style.color.main || "#800C9D",
  "--color__2": style.color.hover || "#291375",

  boxSizing: "border-box",
  position: "absolute",
  top: style.position.top,
  left: style.position.left,
  right: style.position.right,
  bottom: style.position.bottom,
  padding: "0",
  margin: "0",
  ".container": {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: `max(calc(2vh * ${scale}), 1.5vh)`,
  },
  ".icon": {
    maxWidth: `calc(30px * ${iconScale})`,
    aspectRatio: "1 / 1",
    marginRight: "max(5px, 1vw)",
    // margin: `5px max(calc(2vw * ${scale}), .75vw) 5px max(5px, 1vw)`,
  },
  ".text": {
    marginRight: "3px",
  },
  ".app-btn": {
    position: "relative",
    letterSpacing: "1px",
    fontFamily: "var(--text-font-family)",
    fontWeight: style.text.weight || "700",
    fontSize: `max(calc(1.5vw * ${fontScale}), calc(20px * ${fontScale}))`,
    letterSpacing: "var(--text-letter-spacing)",
    color: "var(--text-color)",
    margin: "0",
    padding: `max(calc(8px * ${scale}), 0.5vh) max(calc(25px * ${scale}), 1vw)`,
    border: "none",
    borderLeft: `max(calc(1vw * ${scale}), 5px) solid var(--color__2)`,
    background: `linear-gradient(to right, var(--color__2), var(--color__1), transparent)`,
    backgroundSize: "200% 100%",
    backgroundPosition: "-100%",
    transition: "all 1.5s ease",
    display: "flex",
    alignItems: "center",
    // gap: "max(calc(2vw * ${scale}), .75vw)",
  },
  ".app-btn:hover": {
    cursor: "pointer",
    borderLeftWidth: `max(calc(0.75vw * ${scale}), 10px)`,
    borderLeftColor: "var(--color__1)",
    color: "var(--text-color__hover)",
    backgroundPosition: "100%",
    transform: `translateX(max(calc(-0.75vw * ${scale}), -10px))`,
  },
};
