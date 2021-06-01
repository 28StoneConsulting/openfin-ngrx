import { NgModule } from "@angular/core";
import { OpenfinNgrxService } from "./openfin-ngrx.service";
import { WindowCommunicationService } from "./window-communication.service";

@NgModule({
  providers: [OpenfinNgrxService, WindowCommunicationService],
})
export class OpenfinNgrxModule {}
