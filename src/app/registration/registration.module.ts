import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    // CommonModule,
    // FormsModule,
    // IonicModule,
    // MatSelectModule,
    // MatInputModule,
    // MatFormFieldModule,

    // CommonModule,
    // FormsModule,
    // IonicModule,
    // MatSelectModule,
    // MatInputModule,
    // MatFormFieldModule,
    // MatProgressSpinnerModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatPaginatorModule,
    // ReactiveFormsModule,
    // RegistrationPageRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    RegistrationPageRoutingModule,
  ],
  declarations: [RegistrationPage],
})
export class RegistrationPageModule {}
