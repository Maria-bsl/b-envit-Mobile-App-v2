import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { FormControl, Validators } from '@angular/forms';
import { AppUtilities } from '../core/utils/app-utilities';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verifycode',
  templateUrl: './verifycode.page.html',
  styleUrls: ['./verifycode.page.scss'],
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    MatMenuModule,
    TranslateModule,
  ],
})
export class VerifycodePage implements OnInit, OnDestroy {
  subsriptions: Subscription[] = [];
  eventname: string;
  result: any;
  qrResponse: any;
  private readonly TOKEN_user = 'bizlogicj';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly event_name = 'event_name';
  private readonly eventIDs = 'event_id';
  event_id: string;
  errMsg: any;
  resp: any;
  msg: any;
  userId: any;
  visitor_id: any;
  qrcode: any;
  verifyresponse: any;
  qrinfo: any;
  input: string = '';
  constructor(
    private router: Router,
    private service: ServiceService,
    private loadingCtrl: LoadingController,
    private translate: TranslateService
  ) {}
  postData = {
    qrcode: '',
  };
  ngOnInit() {
    this.eventname = localStorage.getItem(this.event_name);
    this.event_id = localStorage.getItem(this.eventIDs);
  }
  ngOnDestroy(): void {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }
  sendQr() {
    const body = { qr_code: this.postData.qrcode, event_id: this.event_id };
    AppUtilities.startLoading(this.loadingCtrl).then((c) => {
      const native = this.service.sendQr(body);
      this.subsriptions.push(
        native.pipe(finalize(() => c.dismiss())).subscribe({
          next: (res) => {
            this.result = res;
            this.qrResponse = this.result;
            if (this.result.message) {
              AppUtilities.showErrorMessage('', this.result.message);
            } else if (this.qrResponse) {
              const navigationExtras: NavigationExtras = {
                state: {
                  qrinfo: this.qrResponse,
                  qrcode: this.postData.qrcode,
                },
              };
              if (this.qrResponse.unchecked_invitee == 1) {
                this.verify();
              } else {
                this.router.navigate(['tabs/verifyuser'], navigationExtras);
              }
            }
          },
          error: (err) => {
            if (err.error.errorList) {
              let messages = err.error.errorList;
              AppUtilities.showErrorMessage(messages[0], '');
            } else if (err.error.message) {
              AppUtilities.showErrorMessage(err.error.message, '');
            } else {
              this.translate.get('defaults.errors.failed').subscribe({
                next: (message) => {
                  AppUtilities.showErrorMessage(message, '');
                },
              });
            }
          },
        })
      );
    });
  }

  verify() {
    this.userId = localStorage.getItem(this.TOKEN_user);
    this.visitor_id = this.qrResponse.visitor_id;
    const qrcode = this.qrcode;

    const params = {
      event_id: this.event_id,
      qr_code: this.postData.qrcode,
      Number_Of_CheckingIn_Invitees: '1',
      User_Id: this.userId,
    };
    AppUtilities.startLoading(this.loadingCtrl).then((loading) => {
      this.subsriptions.push(
        this.service
          .verifyQr(params)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe({
            next: (res) => {
              this.verifyresponse = res;
              if (this.verifyresponse.status == 1) {
                AppUtilities.showSuccessMessage(
                  '',
                  this.verifyresponse.message
                );
                this.router.navigate(['tabs/dashboard']);
                this.input = '';
                ``;
              } else {
                AppUtilities.showErrorMessage('', this.verifyresponse.message);
                this.input = '';
              }
            },
            error: (err) => {
              if (err.error.errorList) {
                let messages = err.error.errorList;
                AppUtilities.showErrorMessage(messages[0], '');
              } else if (err.error.message) {
                AppUtilities.showErrorMessage(err.error.message, '');
              } else {
                this.translate.get('defaults.errors.failed').subscribe({
                  next: (message) => {
                    AppUtilities.showErrorMessage(message, '');
                  },
                });
              }
              this.router.navigate(['tabs/dashboard']);
            },
          })
      );
    });
  }
  changepass() {
    this.router.navigate(['changepwd']);
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
