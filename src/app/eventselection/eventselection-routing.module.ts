import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventselectionPage } from './eventselection.page';

const routes: Routes = [
  {
    path: '',
    component: EventselectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventselectionPageRoutingModule {}
