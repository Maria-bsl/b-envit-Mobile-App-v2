import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatSliderModule } from '@angular/material/slider';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';

@NgModule({
  imports: [
    NavbarComponent,
    CommonModule,
    IonicModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    MatStepperModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    HighchartsChartModule,
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
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class DashboardPageModule {}
