import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { OpenfinService } from './providers/openfin.service';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter/state/counter.reducer';
import { MainWindowComponent } from './main-window/main-window.component';
import { CounterComponent } from './counter/counter.component';
import { NewWindowComponent } from './new-window/new-window.component';
import { DispatchComponent } from './dispatch/dispatch.component';
import { OpenfinNgrxMetareducerModule } from 'openfin-ngrx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { WindowManagerComponent } from './window-manager/window-manager.component';
import { SelectComponent } from './select/select.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    MainWindowComponent,
    DispatchComponent,
    NewWindowComponent,
    CounterComponent,
    WindowManagerComponent,
    SelectComponent,
  ],
  imports: [
    MatDividerModule,
    MatRadioModule,
    OpenfinNgrxMetareducerModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(
      { count: counterReducer },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
        },
      },
    ),
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
  ],
  providers: [OpenfinService],
  bootstrap: [AppComponent],
})
export class AppModule {}
