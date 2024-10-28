import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwitchEventRoutingModule } from './switch-event-routing.module';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';

@NgModule({
  declarations: [],
  imports: [NavbarComponent, CommonModule, SwitchEventRoutingModule],
})
export class SwitchEventModule {}
