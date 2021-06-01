import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DispatchComponent } from "./dispatch.component";
import { FormsModule } from "@angular/forms";
import { ElectronService } from "../providers/electron.service";
import { OpenfinNgrxService } from "openfin-ngrx";

describe("IpcComponent", () => {
  let component: DispatchComponent;
  let fixture: ComponentFixture<DispatchComponent>;
  const mockWindId = 1;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DispatchComponent],
        imports: [FormsModule],
        providers: [
          {
            provide: ElectronService,
            useValue: {
              remote: { getCurrentWindow: () => ({ id: mockWindId }) },
            },
          },
          { provide: OpenfinNgrxService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
