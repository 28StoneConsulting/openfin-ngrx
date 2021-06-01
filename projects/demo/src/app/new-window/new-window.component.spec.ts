import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {NewWindowComponent} from './new-window.component';
import {ElectronService} from '../providers/electron.service';

describe('NewWindowComponent', () => {
  let component: NewWindowComponent;
  let fixture: ComponentFixture<NewWindowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewWindowComponent],
      providers: [ElectronService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
