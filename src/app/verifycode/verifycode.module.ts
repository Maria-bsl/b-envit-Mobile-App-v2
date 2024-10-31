import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifycodePageRoutingModule } from './verifycode-routing.module';

import { VerifycodePage } from './verifycode.page';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';

@NgModule({
  imports: [
    // NavbarComponent,
    // CommonModule,
    // FormsModule,
    // IonicModule,
    // MatMenuModule,
    VerifycodePageRoutingModule,
  ],
  //declarations: [VerifycodePage],
})
export class VerifycodePageModule {}
