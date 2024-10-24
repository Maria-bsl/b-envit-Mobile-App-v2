import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoverpwdPageRoutingModule } from './recoverpwd-routing.module';

import { RecoverpwdPage } from './recoverpwd.page';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    RecoverpwdPageRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  declarations: [RecoverpwdPage],
})
export class RecoverpwdPageModule {}
