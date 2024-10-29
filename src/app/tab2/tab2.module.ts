import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {
  MatLegacyPaginatorModule as MatPaginatorModule,
  MatLegacyPaginator as MatPaginator,
} from '@angular/material/legacy-paginator';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';

@NgModule({
  imports: [Tab2PageRoutingModule],
  //declarations: [Tab2Page],
})
export class Tab2PageModule {}
