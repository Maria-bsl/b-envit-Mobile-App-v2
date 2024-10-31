import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoverpwdPage } from './recoverpwd.page';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { RecoverpwdPageRoutingModule } from './recoverpwd-routing.module';

@NgModule({
  imports: [
    // CommonModule,
    // FormsModule,
    // IonicModule,
    // MatNativeDateModule,
    // MatInputModule,
    // MatFormFieldModule,
    // ReactiveFormsModule,
    // MatButtonModule,
    RecoverpwdPageRoutingModule,
  ],
  //declarations: [RecoverpwdPage],
})
export class RecoverpwdPageModule {}
