"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win;
var serve;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === "--serve"; });
function createWindow() {
    win = new electron_1.BrowserWindow({
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
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, "dist/index.html"),
            protocol: "file:",
            slashes: true,
        }));
    }
    win.on("closed", function () {
        win = null;
    });
}
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    if (win === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map