import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { MatDialogModule } from '@angular/material/dialog';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgChartsModule } from 'ng2-charts';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatSliderModule,
    MatMenuModule,
    MatDialogModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgChartsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 30,
      outerStrokeWidth: 10,
      innerStrokeWidth: 8,
      outerStrokeColor: '#405980',
      innerStrokeColor: '#95a57c',
      animationDuration: 2000,
    }),
    DashboardPageRoutingModule,
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
