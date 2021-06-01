import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MainWindowComponent} from './main-window.component';
import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('MainWindowComponent', () => {
  let component: MainWindowComponent;
  let fixture: ComponentFixture<MainWindowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MainWindowComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
