import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

let win;
let serve;
const args = process.argv.slice(1);
serve = args.some((val) => val === "--serve");

function createWindow() {
  win = new BrowserWindow({
    width: 650,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
    resizable: true,
  });

  if (serve) {
    win.loadURL("http://localhost:4200");
    win.webContents.openDevTools();
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
