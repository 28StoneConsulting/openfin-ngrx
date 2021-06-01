import { Component } from "@angular/core";
import { OpenfinNgrxService } from "openfin-ngrx";
import { decrement, increment } from "../counter/state/counter.actions";

@Component({
  selector: "app-dispatch",
  templateUrl: "./dispatch.component.html",
  styleUrls: ["./dispatch.component.scss"],
})
export class DispatchComponent {
  constructor(private electronNgrx: OpenfinNgrxService) {}

  sendToParent(action: string) {
    this.electronNgrx.dispatchToParent(
      action === "increment" ? increment() : decrement()
    );
  }

  sendToRoute(action: string, route: string) {
    this.electronNgrx.dispatchToRoute(
      action === "increment" ? increment() : decrement(),
      route
    );
  }

  sendToId(action: string, id: string) {
    this.electronNgrx.dispatchToId(
      action === "increment" ? increment() : decrement(),
      parseInt(id, 10)
    );
  }
}
