import { Injectable } from "@angular/core";

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from "electron";
import * as childProcess from "child_process";

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: any;

  constructor() {
    if (this.isElectron()) {
      const electron = window.require("electron");
      this.ipcRenderer = electron.ipcRenderer;
      this.webFrame = electron.webFrame;
      this.remote = electron.remote;

      this.childProcess = window.require("child_process");
      this.fs = window.require("fs");
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };
}
