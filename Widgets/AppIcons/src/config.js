// TEMPLATE
const template = {
  // Name to display on desktop
  _displayName: "Name to display",
  // Leave empty if you want to open URL, otherwise use app name
  _name: "App Name in source folder",
  // Path on your PC to the app. Parent folders
  _path: "Path to the app",
  // Opens in a new window (true | false)
  _new: false,
  // Opens hidden (true | false)
  _hidden: false,
  // Icon to be used. Located in /src/icons/ folder or URL (optional)
  _icon: "icon.svg",
  // Determines whether to show icon or not (true | false)
  _showIcon: true,
  // Determines whether to show app name (true | false)
  _showName: true,

  style: {
    "--text-font-family": "Marker Felt, American Typewriter",
    "--text-letter-spacing": "5px",
    "--text-color": "#f00",
    "--text-color__hover": "#eeeeeebb",
    "--color__1": "#eeeeeebb",
    "--color__2": "#f00",
  },
};

//////////////////////////////////////////////////////
// CONFIG
//////////////////////////////////////////////////////

const showAllIcons = window.screen.width > 2000;

export const apps = [
  {
    _displayName: "Visual Studio Code",
    _name: "Visual Studio Code",
    _path: "/Applications/",
    _new: true,
    _hidden: false,
    _showIcon: true,
    _icon: "visual-studio-code.png",
    _showName: showAllIcons,
    style: {
      "--text-color__hover": "#3AABF2",
      "--color__2": "#3AABF2",
    },
  },
  {
    _displayName: "Firefox",
    _name: "Firefox",
    _path: "/Applications/",
    _new: true,
    _hidden: false,
    _showIcon: true,
    _icon: "firefox.png",
    _showName: showAllIcons,
    style: {
      "--text-color__hover": "#FF9728", //"#FF4739",
      "--color__2": "#FF9728", //"#FF4739",
    },
  },
  {
    _displayName: "Music",
    _name: "Music",
    _path: "/System/Applications/",
    _new: false,
    _hidden: false,
    _showIcon: true,
    _icon: "music.png",
    _showName: showAllIcons,
    style: {
      "--text-color__hover": "#FC2F50",
      "--color__2": "#FC2F50",
    },
  },
  {
    _displayName: "YouTube",
    _name: "",
    _path: "https://www.youtube.com",
    _new: false,
    _hidden: false,
    _showIcon: true,
    _icon: "youtube.png",
    _showName: showAllIcons,
    style: {
      "--text-color__hover": "#FF0000",
      "--color__2": "#FF0000",
    },
  },
  {
    _displayName: "Reddit",
    _name: "",
    _path: "https://www.reddit.com",
    _new: false,
    _hidden: false,
    _showIcon: true,
    _icon: "reddit.png",
    _showName: showAllIcons,
    style: {
      "--text-color__hover": "#FF4500",
      "--color__2": "#FF4500",
    },
  },
];

//////////////////////////////////////////////////////
// STYLING
//////////////////////////////////////////////////////

export const style = {
  scale: showAllIcons ? 0.6 : 0.8,
  fontScale: 0.65,
  iconScale: showAllIcons ? 0.95 : 1.25,
  text: {
    family: "Futura, Avenir Next, Verdana, Roboto, sans-serif",
    weight: "700",
    letterSpacing: "1.5px",
    color: "#ddd",
  },
  color: {
    main: "#5D309E88", //"#6F13BF", //"#800C9D",
    hover: "#DCA6C6", //"#291375",
  },
  position: {
    top: "4vh",
    left: "max(10px, 3vw)",
    right: "",
    bottom: "",
  },
};
apps.forEach((app) => {
  Object.assign(app, {
    showIcon() {
      return this._showIcon;
    },
    icon() {
      return this._icon;
    },
    showName() {
      return this._showName;
    },
    displayName() {
      return this._displayName;
    },
    appPath() {
      // prettier-ignore
      return (this._path + this._name).replaceAll(" ", "\\ ");
    },
    command() {
      return `open${this._hidden ? " -j" : " "}${
        this._new ? " -n" : " "
      } ${this.appPath()}${!this._path.includes("http") ? ".app" : ""}`;
    },
  });
});
