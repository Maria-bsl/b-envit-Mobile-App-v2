import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangepwdPageRoutingModule } from './changepwd-routing.module';

import { ChangepwdPage } from './changepwd.page';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

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
