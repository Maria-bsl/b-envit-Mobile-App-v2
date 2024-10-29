import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangepwdPageRoutingModule } from './changepwd-routing.module';

import { ChangepwdPage } from './changepwd.page';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

@NgModule({
  imports: [
    // CommonModule,
    // FormsModule,
    // IonicModule,
    // MatInputModule,
    // MatFormFieldModule,
    // ChangepwdPageRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    ChangepwdPageRoutingModule,
  ],
  //declarations: [ChangepwdPage],
})
export class ChangepwdPageModule {}
