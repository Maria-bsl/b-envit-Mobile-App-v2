import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  ReactiveFormsModule,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { HttpClientModule } from '@angular/common/http';
import { EventselectionPipe } from './eventselection.pipe';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { HTTP } from '@ionic-native/http/ngx'; //<=== Import this
import { HighchartsChartModule } from 'highcharts-angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@NgModule({
  declarations: [AppComponent, EventselectionPipe],
  imports: [
    BrowserModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HighchartsChartModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP,
    QRScanner,
    SplashScreen,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
