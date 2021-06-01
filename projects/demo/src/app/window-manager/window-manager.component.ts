import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { Observable } from "rxjs";
import { ElectronService } from "../providers/electron.service";

@Component({
  selector: "window-manager",
  templateUrl: "./window-manager.component.html",
  styleUrls: ["./window-manager.component.scss"],
})
export class WindowManagerComponent implements OnInit {
  winId: number;
  windowRoute$: Observable<string>;

  constructor(
    private electronService: ElectronService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.winId = this.electronService.remote.getCurrentWindow().id;
    this.windowRoute$ = this.activatedRoute.url.pipe(
      map(
        (urlSegments: UrlSegment[]) =>
          "/" +
          urlSegments.map((urlSegment: UrlSegment) => urlSegment.path).join("/")
      )
    );
  }
}
