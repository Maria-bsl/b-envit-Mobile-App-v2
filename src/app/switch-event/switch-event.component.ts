import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLegacyListModule as MatListModule,
  MatLegacySelectionList as MatSelectionList,
} from '@angular/material/legacy-list';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { Router, NavigationExtras } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { finalize, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { EventDetailsResponse } from '../core/response/EventDetailsResponse';
import { AppUtilities } from '../core/utils/app-utilities';
import { EventChoice } from '../services/params/eventschoice';
import { ServiceService } from '../services/service.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-switch-event',
  templateUrl: './switch-event.component.html',
  styleUrls: ['./switch-event.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    IonicModule,
    MatListModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatButtonModule,
    NavbarComponent,
    TranslateModule,
  ],
})
export class SwitchEventComponent implements OnInit, OnDestroy {
  selected: number = -1;
  eventsList: EventDetailsResponse[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private controller: LoadingController,
    private service: ServiceService
  ) {}
  ngOnInit() {
    this.eventsList = JSON.parse(localStorage.getItem('event_details_list'));
    if (!this.eventsList) this.router.navigate(['login']);
    let eventId = localStorage.getItem('event_id');
    if (eventId !== undefined && eventId !== null) {
      let found = this.eventsList.find((c) => c.event_id === Number(eventId));
      if (found) {
        this.selected = this.eventsList.indexOf(found);
      }
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  eventChanged(index: any) {
    if (index < 0 || index > this.eventsList.length - 1)
      throw Error('Event index is out of range.');
    this.selected = index;
    localStorage.setItem(
      'event_name',
      this.eventsList.at(this.selected).event_name
    );
  }
  openSelectedEvent(selected: EventDetailsResponse) {
    const navigationExtras: NavigationExtras = {
      state: {
        data_from_user: selected.event_id,
      },
      replaceUrl: true,
    };
    localStorage.setItem(
      'event_id',
      this.eventsList.at(this.selected).event_id.toString()
    );
    this.router.navigateByUrl('tabs/dashboard', navigationExtras);
    //this.router.navigate(['tabs/dashboard'], navigationExtras);
  }
  async openDashboard() {
    if (this.selected === -1) {
      AppUtilities.showWarningMessage('', 'Please select an event');
      return;
    }
    let selected: EventDetailsResponse = this.eventsList.at(this.selected);
    let tokenName = localStorage.getItem(AppUtilities.TOKEN_NAME);
    const params = {
      mobile_number: JSON.parse(tokenName).mobile,
      event_id: selected.event_id.toString(),
    } as EventChoice;
    AppUtilities.startLoading(this.controller)
      .then((loading) => {
        this.subscriptions.push(
          this.service
            .EventChoices(params)
            .pipe(finalize(() => loading.dismiss()))
            .subscribe({
              next: (result: any) => {
                localStorage.setItem(
                  AppUtilities.TOKEN_user,
                  result.user_id.toString()
                );
                localStorage.setItem(
                  AppUtilities.TOKEN_Cstomer,
                  result.customer_admin_id.toString()
                );
              },
              error: (error) => {
                loading.dismiss();
                throw error;
              },
              complete: () => {
                this.openSelectedEvent(selected);
              },
            })
        );
      })
      // .then(() => {
      //   this.openSelectedEvent(selected);
      // })
      .catch((err) => {
        throw err;
      });
  }
}
