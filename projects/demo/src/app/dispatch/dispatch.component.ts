import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { decrement, decrementParent, increment, incrementParent } from '../counter/state/counter.actions';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent {
  constructor(private store: Store) {}

  sendToParent(action: string) {
    this.store.dispatch(action === 'increment' ? incrementParent() : decrementParent());
  }

  sendToRoute(action: string, route: string) {
    this.store.dispatch(
      action === 'increment'
        ? increment({ type: 'route', name: route }, true)
        : decrement({ type: 'route', name: route }, true),
    );
  }

  sendToWindow(action: string, windowName: string) {
    this.store.dispatch(
      action === 'increment'
        ? increment({ type: 'window', name: windowName }, true)
        : decrement({ type: 'window', name: windowName }, true),
    );
  }
}
