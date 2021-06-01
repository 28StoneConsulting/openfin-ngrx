import { Component } from "@angular/core";
import { OpenfinNgrxService } from "openfin-ngrx";
import { doubleCounter, selectCounter } from "../counter/state/counter.reducer";

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
})
export class SelectComponent {
  selectFrom: "id" | "parent" = "id";
  counter: number;

  constructor(private electronNgrxService: OpenfinNgrxService) {}

  selectCounterFromWindow(windowId: string) {
    this.electronNgrxService
      .selectFromId<number>(parseInt(windowId, 10), selectCounter)
      .subscribe((data) => (this.counter = data));
  }

  selectCounterFromParent() {
    this.electronNgrxService
      .selectFromParent<number>(doubleCounter, { a: 2 })
      .subscribe((data) => (this.counter = data));
  }
}
