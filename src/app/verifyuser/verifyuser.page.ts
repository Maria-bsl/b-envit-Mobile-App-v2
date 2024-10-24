import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-verifyuser',
  templateUrl: './verifyuser.page.html',
  styleUrls: ['./verifyuser.page.scss'],
})
export class VerifyuserPage implements OnInit {
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
  count: any

  constructor(private loadingCtrl: LoadingController, private router: Router,
    private route: ActivatedRoute, private service: ServiceService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.qrinfo = this.router.getCurrentNavigation().extras.state.qrinfo;
        this.qrcode = this.router.getCurrentNavigation().extras.state.qrcode;
        this.count = Array.from({ length: this.qrinfo.unchecked_invitee }, (_, i) => i + 1);
        console.log(this.qrinfo.unchecked_invitee, "invitee count");
      }

    });

  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  postData = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Number_Of_CheckingIn_Invitees: ''
  };
  ngOnInit() {
    this.eventname = localStorage.getItem(this.event_name);
    this.event_id = localStorage.getItem(this.eventIDs)

  }
  pressNum(num: any) {

    //Do Not Allow . more than once
    if (num == ".") {
      if (this.input != "") {

      }
    }

    //Do Not Allow 0 at beginning. 
    //Javascript will throw Octal literals are not allowed in strict mode.
    if (num == "0") {
      if (this.input == "") {
        return;
      }
      const PrevKey = this.input[this.input.length - 1];
      if (PrevKey === '/' || PrevKey === '*' || PrevKey === '-' || PrevKey === '+') {
        return;
      }
    }
    this.input = this.input + num

    // this.calcAnswer();
  }
  allClear() {
    // this.result = '';
    this.input = '';
  }
  async verifyuser() {
    // this.visitorID = localStorage.getItem()
    this.userId = localStorage.getItem(this.TOKEN_user);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.visitor_id = this.qrinfo.visitor_id;
    const qrcode = this.qrcode;
    const params = {
      //   // eslint-disable-next-line @typescript-eslint/naming-convention
      event_id: this.event_id, qr_code: qrcode,
      //   // eslint-disable-next-line @typescript-eslint/naming-convention
      Number_Of_CheckingIn_Invitees: this.input, User_Id: this.userId
    };
    // console.log(JSON.stringify(params),'paramsss');
    const loading = await this.loadingCtrl.create({
      message: 'please wait...',
      spinner: 'lines-small'
    });
    await loading.present();
    const native = this.service.verifyQr(params);
    from(native).pipe(
      finalize(() => loading.dismiss()))
      .subscribe(
        res => {
          this.verifyresponse = res;
          // eslint-disable-next-line eqeqeq
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
          console.log(JSON.stringify(error), "erorr found")
        }

      );
  }
}
