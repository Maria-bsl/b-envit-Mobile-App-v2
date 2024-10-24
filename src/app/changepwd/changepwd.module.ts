import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangepwdPageRoutingModule } from './changepwd-routing.module';

import { ChangepwdPage } from './changepwd.page';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatInputModule,
    MatFormFieldModule,
    ChangepwdPageRoutingModule,
  ],
  declarations: [ChangepwdPage],
})
export class ChangepwdPageModule {}
