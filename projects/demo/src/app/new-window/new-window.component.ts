import { Component } from '@angular/core';

@Component({
  selector: 'app-new-window',
  templateUrl: './new-window.component.html',
  styleUrls: ['./new-window.component.scss'],
})
export class NewWindowComponent {
  constructor() {}

  openWindow(route) {
    fin.Window.create({
      defaultHeight: 800,
      defaultWidth: 650,
      name: route,
      url: window.location.origin + route,
    });
  }
}
