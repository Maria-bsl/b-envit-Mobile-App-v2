import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ServiceService } from '../services/service.service';
import { AppUtilities } from '../core/utils/app-utilities';

@Component({
  selector: 'app-verifyuser',
  templateUrl: './verifyuser.page.html',
  styleUrls: ['./verifyuser.page.scss'],
})
export class VerifyuserPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  eventname: string;
  userId: any;
  qrinfo: any;
  qrcode: any;
  verifyresponse: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  visitor_id: any;

  input: string = '';
  result: string = '';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly event_name = 'event_name';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly TOKEN_user = 'bizlogicj';
  private readonly visitorId = 'visitorID';
  private readonly eventIDs = 'event_id';
  event_id: string;
  errMsg: any;
  resp: any;
  msg: any;
  count: any;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private service: ServiceService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.qrinfo = this.router.getCurrentNavigation().extras.state.qrinfo;
        this.qrcode = this.router.getCurrentNavigation().extras.state.qrcode;
        this.count = Array.from(
          { length: this.qrinfo.unchecked_invitee },
          (_, i) => i + 1
        );
        console.log(this.qrinfo.unchecked_invitee, 'invitee count');
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  postData = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Number_Of_CheckingIn_Invitees: '',
  };
  ngOnInit() {
    this.eventname = localStorage.getItem(this.event_name);
    this.event_id = localStorage.getItem(this.eventIDs);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  pressNum(num: any) {
    //Do Not Allow . more than once
    if (num == '.') {
      if (this.input != '') {
      }
    }

    //Do Not Allow 0 at beginning.
    //Javascript will throw Octal literals are not allowed in strict mode.
    if (num == '0') {
      if (this.input == '') {
        return;
      }
      const PrevKey = this.input[this.input.length - 1];
      if (
        PrevKey === '/' ||
        PrevKey === '*' ||
        PrevKey === '-' ||
        PrevKey === '+'
      ) {
        return;
      }
    }
    this.input = this.input + num;

    // this.calcAnswer();
  }
  allClear() {
    // this.result = '';
    this.input = '';
  }
  verifyuser() {
    this.userId = localStorage.getItem(this.TOKEN_user);
    this.visitor_id = this.qrinfo.visitor_id;
    const qrcode = this.qrcode;
    const params = {
      event_id: this.event_id,
      qr_code: qrcode,
      Number_Of_CheckingIn_Invitees: this.input,
      User_Id: this.userId,
    };
    AppUtilities.startLoading(this.loadingCtrl)
      .then((loading) => {
        this.subscriptions.push(
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
                  AppUtilities.showErrorMessage(
                    '',
                    this.verifyresponse.message
                  );
                  this.input = '';
                }
              },
              error: (error) => {
                this.errMsg = error;
                this.resp = this.errMsg.error;
                this.msg = this.resp.message;
                AppUtilities.showErrorMessage('', this.msg);
              },
            })
        );
      })
      .catch((err) => {
        throw err;
      });
  }
}
