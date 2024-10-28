/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ServiceService } from '../services/service.service';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { from, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppUtilities } from '../core/utils/app-utilities';

export interface userData {
  eventDetails: any;
}

@Component({
  selector: 'app-eventselection',
  templateUrl: './eventselection.page.html',
  styleUrls: ['./eventselection.page.scss'],
})
export class EventselectionPage implements OnInit, OnDestroy {
  Events: any;
  datas: any;
  mobileNumber: any;
  eventname: any;
  mob: any;
  suscriptions: Subscription[] = [];

  private readonly TOKEN_NAME = 'profanis_auth';
  private readonly TOKEN_user = 'bizlogicj';
  private readonly event_name = 'event_name';
  private readonly TOKEN_Cstomer = 'cstID';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  property: any;

  constructor(
    private loadingCtrl: LoadingController,
    private service: ServiceService,
    @Inject(MAT_DIALOG_DATA) public data: userData,
    private router: Router
  ) {
    this.Events = data;
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  postData = {
    event_id: '',
  };
  onSelect(event: any) {
    this.eventname = event.event_name;
    localStorage.setItem(this.event_name, this.eventname);
  }
  ngOnInit() {
    this.datas = localStorage.getItem(this.TOKEN_NAME);

    this.mob = JSON.parse(this.datas);
    this.mobileNumber = this.mob.mobile;
  }
  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }
  async loginEvent() {
    const params = {
      mobile_number: this.mobileNumber,
      event_id: this.postData.event_id,
    };
    const loading = await this.loadingCtrl.create({
      message: 'please wait...',
      spinner: 'lines-small',
    });
    await loading.present();
    const native = this.service.EventChoices(params);
    from(native)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((arg) => {
        this.property = arg;
        localStorage.setItem(
          this.TOKEN_user,
          JSON.stringify(this.property.user_id)
        );
        localStorage.setItem(
          this.TOKEN_Cstomer,
          JSON.stringify(this.property.customer_admin_id)
        );
      });
    const navigationExtras: NavigationExtras = {
      state: {
        data_from_user: this.postData.event_id,
      },
    };
    if (this.postData.event_id == '') {
      AppUtilities.showErrorMessage('', 'Please select an event');
    } else {
      this.router.navigateByUrl('tabs/dashboard', navigationExtras);
    }
  }
}
