import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwitchEventComponent } from './switch-event.component';

const routes: Routes = [
  {
    path: '',
    component: SwitchEventComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwitchEventRoutingModule {}
