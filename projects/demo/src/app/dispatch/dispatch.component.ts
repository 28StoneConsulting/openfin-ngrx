import { Component } from "@angular/core";
import { OpenfinNgrxService } from "openfin-ngrx";
import { decrement, increment } from "../counter/state/counter.actions";

@Component({
  selector: "app-dispatch",
  templateUrl: "./dispatch.component.html",
  styleUrls: ["./dispatch.component.scss"],
})
export class DispatchComponent {
  constructor(private openfinNgrx: OpenfinNgrxService) {}

  sendToParent(action: string) {
    this.openfinNgrx.dispatchToParent(
      action === "increment" ? increment() : decrement()
    );
  }

  sendToRoute(action: string, route: string) {
    this.openfinNgrx.dispatchToRoute(
      action === "increment" ? increment() : decrement(),
      route
    );
  }

  sendToWindow(action: string, windowName: string) {
    this.openfinNgrx.dispatchToWindow(
      action === "increment" ? increment() : decrement(),
      windowName
    );
  }
}
