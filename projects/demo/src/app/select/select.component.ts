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

  constructor(private openfinNgrxService: OpenfinNgrxService) {}

  selectCounterFromWindow(windowName: string) {
    this.openfinNgrxService
      .selectFromWindow<number>(windowName, selectCounter)
      .subscribe((data) => (this.counter = data));
  }

  selectCounterFromParent() {
    this.openfinNgrxService
      .selectFromParent<number>(selectCounter)
      .subscribe((data) => (this.counter = data));
  }
}
