import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tab2.page').then((c) => c.Tab2Page),
    //component: Tab2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab2PageRoutingModule {}
