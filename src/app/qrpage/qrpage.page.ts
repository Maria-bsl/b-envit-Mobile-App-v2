import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiceService } from '../services/service.service';
import { AppUtilities } from '../core/utils/app-utilities';

@Component({
  selector: 'app-qrpage',
  templateUrl: './qrpage.page.html',
  styleUrls: ['./qrpage.page.scss'],
})
export class QrpagePage implements OnInit {
  result: any;
  qrInfo: any;
  qrjson: any;
  qrcode: any;
  makeJson: any;
  getJson: any;
  split2: any;
  qrResponse: any;
  visitorID: any;
  userInfo: any;
  userId: any;
  conversion: any;
  userIdObj: any;
  verifyresponse: any;
  split3: any;
  qr1: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  visitor_id: any;
  cardsize: any;
  cardloop: any;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly TOKEN_NAME = 'profanis_auth';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly TOKEN_user = 'bizlogicj';
  //ji6sd
  private readonly eventIDs = 'event_id';
  event_id: any;
  errMsg: any;
  resp: any;
  msg: any;

  counts: any[];
  inviteeN: any;
  venue: number[];

  input: any;
  constructor(
    private service: ServiceService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.qrInfo = this.router.getCurrentNavigation().extras.state.result;
        this.qrjson = this.qrInfo.split(';');
        this.split2 = this.qrjson[0].split(': ');
        this.split3 = JSON.stringify(this.split2).split(', ');
        this.qr1 = this.split2[1];
        this.qrcode = this.qr1.trim();
        const cardsize = this.qrjson[2].split(': ');
        const inviteeName = this.qrjson[1].split(': ');
        this.inviteeN = inviteeName[1];
        this.cardsize = cardsize[1];
        const size = this.cardsize;
        const venue = this.qrjson[3].split(': ');
        this.venue = venue[1];
        this.counts = Array.from({ length: this.cardsize }, (_, i) => i + 1);
        this.visitorID = this.qrjson[2].split(': ')[1];
        const body = { qr_code: this.qrcode, event_id: this.event_id };
        this.service.sendQr(body).subscribe((res) => {
          this.result = res;
          this.qrResponse = this.result[0];
          this.visitor_id = this.qrResponse.visitor_id;
        });
      }

      if (this.cardsize == 1) {
        this.autoVerify();
      }
    });
  }

  postData = {
    Number_Of_CheckingIn_Invitees: '',
  };

  ngOnInit() {
    this.event_id = localStorage.getItem(this.eventIDs);
  }

  pressNum(num: any) {
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
    this.input = '';
  }

  async verify() {
    // this.getQrinfo();
    this.userId = localStorage.getItem(this.TOKEN_user);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const params = {
      event_id: this.event_id,
      qr_code: this.qrcode,
      Number_Of_CheckingIn_Invitees:
        this.postData.Number_Of_CheckingIn_Invitees,
      User_Id: this.userId,
    };
    console.log(JSON.stringify(params), 'verifyQR params');
    const loading = await this.loadingCtrl.create({
      message: 'please wait...',
      spinner: 'lines-small',
    });
    await loading.present();
    const native = this.service.verifyQr(params);
    from(native)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        (res) => {
          this.verifyresponse = res;

          if (this.verifyresponse.status == 1) {
            AppUtilities.showSuccessMessage('', this.verifyresponse.message);
            this.router.navigate(['tabs/dashboard']);
            this.input = '';
          } else {
            AppUtilities.showErrorMessage('', this.verifyresponse.message);
            this.input = '';
          }
        },
        (error) => {
          this.errMsg = error;
          this.resp = this.errMsg.error;
          this.msg = this.resp.message;
          AppUtilities.showErrorMessage('', this.msg);
        }
      );
  }
  async autoVerify() {
    this.userId = localStorage.getItem(this.TOKEN_user);
    const params = {
      event_id: this.event_id,
      qr_code: this.qrcode,
      Number_Of_CheckingIn_Invitees: '1',
      User_Id: this.userId,
    };
    const loading = await this.loadingCtrl.create({
      message: 'please wait...',
      spinner: 'lines-small',
    });
    // await loading.present();
    const native = this.service.verifyQr(params);
    from(native)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        (res) => {
          this.verifyresponse = res;
          console.log(JSON.stringify(this.verifyresponse), 'qr code response');
          if (this.verifyresponse.status == 1) {
            AppUtilities.showSuccessMessage('', this.verifyresponse.message);
            this.router.navigate(['tabs/dashboard']);
            this.input = '';
          } else {
            AppUtilities.showErrorMessage('', this.verifyresponse.message);
            this.input = '';
            this.router.navigate(['tabs/dashboard']);
          }
        },
        (error) => {
          this.errMsg = error;
          this.resp = this.errMsg.error;
          this.msg = this.resp.message;
          AppUtilities.showErrorMessage('', this.msg);
          this.router.navigate(['tabs/dashboard']);
        }
      );
  }
  backBtn() {
    this.router.navigate(['tabs/dashboard']);
  }
}
