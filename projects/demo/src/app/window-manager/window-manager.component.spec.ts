import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {WindowManagerComponent} from './window-manager.component';

describe('WindowManagerComponent', () => {
  let component: WindowManagerComponent;
  let fixture: ComponentFixture<WindowManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WindowManagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
