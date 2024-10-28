import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLegacyListModule as MatListModule,
  MatLegacySelectionList as MatSelectionList,
} from '@angular/material/legacy-list';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { Router, NavigationExtras } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { EventDetailsResponse } from '../core/response/EventDetailsResponse';
import { AppUtilities } from '../core/utils/app-utilities';
import { EventChoice } from '../services/params/eventschoice';
import { ServiceService } from '../services/service.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';

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
  ],
})
export class SwitchEventComponent implements OnInit {
  selected: number = -1;
  eventsList: EventDetailsResponse[] = [];
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
    // const navigationExtras: NavigationExtras = {
    //   state: {
    //     data_from_user: selected.event_id,
    //   },
    // };
    localStorage.setItem(
      'event_id',
      this.eventsList.at(this.selected).event_id.toString()
    );
    //this.router.navigateByUrl('tabs/dashboard', navigationExtras);
    this.router.navigate(['tabs/dashboard']);
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
        this.service
          .EventChoices(params)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe({
            next: (result: any) => {
              localStorage.setItem(
                AppUtilities.TOKEN_user,
                JSON.stringify(result.user_id)
              );
              localStorage.setItem(
                AppUtilities.TOKEN_Cstomer,
                JSON.stringify(result.customer_admin_id)
              );
              this.openSelectedEvent(selected);
            },
            error: (err) => {
              throw err;
            },
          });
      })
      .catch((err) => {
        throw err;
      });
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
