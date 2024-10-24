import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { ServiceService } from '../services/service.service';


@Component({
  selector: 'app-verifycode',
  templateUrl: './verifycode.page.html',
  styleUrls: ['./verifycode.page.scss'],
})
export class VerifycodePage implements OnInit {
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

  constructor(private router: Router, private service: ServiceService, private loadingCtrl: LoadingController) { }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  postData = {
    qrcode: ''
  };
  async ngOnInit() {
    this.eventname = localStorage.getItem(this.event_name);
    this.event_id = localStorage.getItem(this.eventIDs)

    // eslint-disable-next-line @typescript-eslint/naming-convention
  }
  async sendQr() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const body = { qr_code: this.postData.qrcode, event_id: this.event_id };
    console.log(JSON.stringify(body), 'qrcode entered');
    const loading = await this.loadingCtrl.create({
      message: 'please wait...',
      spinner: 'lines-small'
    });
    await loading.present();
    const native = this.service.sendQr(body);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    from(native).pipe(
      finalize(() => loading.dismiss()))
      .subscribe(
        res => {
          this.result = res;
          this.qrResponse = this.result;
          if (this.result.message) {
            Swal.fire({
              title: '',
              text: this.result.message,
              icon: 'error'
            });
          } else if (this.qrResponse) {
            const navigationExtras: NavigationExtras = {
              state: {
                qrinfo: this.qrResponse,
                qrcode: this.postData.qrcode
              }
            };
            if (this.qrResponse.unchecked_invitee == 1) {
              this.verify();
            } else {
              this.router.navigate(['tabs/verifyuser'], navigationExtras);
            }
          }
        },
        error => {
          this.errMsg = error;
          // console.log(this.errMsg,"fff");
          this.resp = this.errMsg.error
          this.msg = this.resp.message

          Swal.fire({
            title: '',
            text: this.msg,
            icon: 'error'
          });
          console.log(JSON.stringify(error), "erorr found")
        }
      );
  }


  async verify() {
     this.userId = localStorage.getItem(this.TOKEN_user);
     this.visitor_id = this.qrResponse.visitor_id;
    const qrcode = this.qrcode;

    const params = {
       event_id: this.event_id, qr_code: this.postData.qrcode,
       Number_Of_CheckingIn_Invitees: '1', User_Id: this.userId
    };

     const loading = await this.loadingCtrl.create({
      message: 'please wait...',
      spinner: 'lines-small'
    });
    //  await loading.present();
    const native = this.service.verifyQr(params);
    from(native).pipe(
      finalize(() => loading.dismiss()))
      .subscribe(
        res => {
          this.verifyresponse = res;
           if (this.verifyresponse.status == 1) {
            Swal.fire({
              title: '',
              text: this.verifyresponse.message,
              icon: 'success'
            });
            this.router.navigate(['tabs/dashboard']);
            this.input = ''; ``
          } else {
            Swal.fire({
              title: '',
              text: this.verifyresponse.message,
              icon: 'error',
            });
            this.input = '';
          }
        },
        error => {
          this.errMsg = error;
          this.resp = this.errMsg.error;
          this.msg = this.resp.message

          Swal.fire({
            title: '',
            text: this.msg,
            icon: 'error'
          });
          this.router.navigate(['tabs/dashboard']);
        }
      );
  }

}
