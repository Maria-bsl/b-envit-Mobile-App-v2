import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.page').then((c) => c.DashboardPage),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
