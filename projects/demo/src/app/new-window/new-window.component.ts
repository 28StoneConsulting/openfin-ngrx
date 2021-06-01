import { Component } from "@angular/core";
import { ElectronService } from "../providers/electron.service";

@Component({
  selector: "app-new-window",
  templateUrl: "./new-window.component.html",
  styleUrls: ["./new-window.component.scss"],
})
export class NewWindowComponent {
  constructor(private electronService: ElectronService) {}

  openWindow(route) {
    const BrowserWindow = this.electronService.remote.BrowserWindow;
    const newWin = new BrowserWindow({
      height: 800,
      width: 650,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
      parent: this.electronService.remote.getCurrentWindow(),
      resizable: true,
    });
    newWin.loadURL(window.location.origin + route);
  }
}
