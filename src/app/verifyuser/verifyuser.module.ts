import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyuserPageRoutingModule } from './verifyuser-routing.module';

import { VerifyuserPage } from './verifyuser.page';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatSelectModule,
    ReactiveFormsModule,
    VerifyuserPageRoutingModule,
  ],
  declarations: [VerifyuserPage],
})
export class VerifyuserPageModule {}
