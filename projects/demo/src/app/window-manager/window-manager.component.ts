import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'window-manager',
  templateUrl: './window-manager.component.html',
  styleUrls: ['./window-manager.component.scss'],
})
export class WindowManagerComponent implements OnInit {
  windowName: string;
  windowRoute$: Observable<string>;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.windowName = fin.me.name;
    this.windowRoute$ = this.activatedRoute.url.pipe(
      map((urlSegments: UrlSegment[]) => '/' + urlSegments.map((urlSegment: UrlSegment) => urlSegment.path).join('/')),
    );
  }
}
