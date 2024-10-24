import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoverpwdPage } from './recoverpwd.page';

const routes: Routes = [
  {
    path: '',
    component: RecoverpwdPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoverpwdPageRoutingModule {}
