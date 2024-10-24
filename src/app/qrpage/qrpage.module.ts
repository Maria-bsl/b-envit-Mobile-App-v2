import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrpagePageRoutingModule } from './qrpage-routing.module';

import { QrpagePage } from './qrpage.page';
import { MatSelectModule } from '@angular/material/select';
// import {MatSelectModule} from '@angular/material/select';
// import {MatSelectModule} from '@angular/material/select';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatSelectModule,
    ReactiveFormsModule,
    QrpagePageRoutingModule,
  ],
  declarations: [QrpagePage],
})
export class QrpagePageModule {}
