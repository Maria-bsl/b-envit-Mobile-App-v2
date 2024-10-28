// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { LoadingController } from '@ionic/angular';
// import { from } from 'rxjs';
// import { finalize } from 'rxjs/operators';
// import Swal from 'sweetalert2';
// import { ServiceService } from '../services/service.service';

// @Component({
//   selector: 'app-changepwd',
//   templateUrl: './changepwd.page.html',
//   styleUrls: ['./changepwd.page.scss'],
// })
// export class ChangepwdPage implements OnInit {
//   private readonly TOKEN_NAME = 'profanis_auth';
//   datas: any;
//   mobileNumber: any;
//   response: any;
//   errMsg: any;
//   resp: any;
//   msg: any;
//   constructor(private router: Router, private service: ServiceService, private loadingCtrl: LoadingController) { }
//   postData = {
//     current_password: '',
//     New_Password: ''
//   }
//   ngOnInit() {
//     this.datas = localStorage.getItem(this.TOKEN_NAME);
//    const convertion = JSON.parse(this.datas);

//    this.mobileNumber = convertion.mobile;
//    }

//   async changPass(){
//     const loading = await this.loadingCtrl.create({
//       // message: 'please wait...',
//       spinner: 'lines-small'
//     });
//     await loading.present();
//      const body = {mobile_number:this.mobileNumber, current_password: this.postData.current_password,New_Password:this.postData.New_Password}
//       let native = this.service.ChangePswd(body);
//      from(native).pipe(
//       finalize(()=> loading.dismiss()))
//       .subscribe(
//         res=>{
//           this.response = res
//           Swal.fire({
//             title: '',
//             text: 'Password Successfuly changed',
//             icon: 'success'
//           });
//           this.router.navigate(['login']);

//          },
//         error=>{
//           this.errMsg = error;
//          this.resp = JSON.parse(this.errMsg.error);
//          this.msg = this.resp.message

//          Swal.fire({
//            title: '',
//            text: this.msg,
//            icon: 'error'
//          });
//          }
//       )
//    }
//    backBtn(){
//      this.router.navigate(['tabs/dashboard']);
//    }

// }

import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { filter, finalize, pairwise } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ServiceService } from '../services/service.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppUtilities } from '../core/utils/app-utilities';
import { Location } from '@angular/common';

@Component({
  selector: 'app-changepwd',
  templateUrl: './changepwd.page.html',
  styleUrls: ['./changepwd.page.scss'],
})
export class ChangepwdPage implements OnInit {
  private readonly TOKEN_NAME = 'profanis_auth';
  datas: any;
  mobileNumber: any;
  response: any;
  errMsg: any;
  resp: any;
  msg: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ServiceService,
    private loadingCtrl: LoadingController,
    private location: Location
  ) {}
  // postData = {
  //   current_password: '',
  //   New_Password: '',
  // };
  private getChangePasswordPayload(form: any) {
    let body = new Map();
    body.set('mobile_number', this.mobileNumber);
    body.set('current_password', form.current_password);
    body.set('New_Password', form.New_Password);
    const payload = Array.from(body).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: any });
    return payload;
  }
  postData!: FormGroup;
  ngOnInit() {
    this.datas = localStorage.getItem(this.TOKEN_NAME);
    const convertion = JSON.parse(this.datas);

    this.mobileNumber = convertion.mobile;
    this.createPostDataFormGroup();
  }
  private createPostDataFormGroup() {
    this.postData = this.fb.group({
      current_password: this.fb.control('', [Validators.required]),
      Create_Password: this.fb.control('', [
        Validators.required,
        AppUtilities.matchValidator('New_Password', true),
      ]),
      New_Password: this.fb.control('', [
        Validators.required,
        AppUtilities.matchValidator('Create_Password'),
      ]),
    });
  }
  async changPass() {
    if (this.postData.invalid) {
      this.postData.markAllAsTouched();
      return;
    }
    AppUtilities.startLoading(this.loadingCtrl).then((c) => {
      let body = this.getChangePasswordPayload(this.postData.value);
      let native = this.service.ChangePswd(body);
      native.pipe(finalize(() => c.dismiss())).subscribe({
        next: (res) => {
          this.response = res;
          Swal.fire({
            title: '',
            text: 'Password Successfuly changed',
            icon: 'success',
            heightAuto: false,
          });
          this.router.navigate(['login']);
        },
        error: (err) => {
          Swal.fire({
            title: '',
            text: err.error.Message,
            icon: 'error',
            heightAuto: false,
          });
        },
      });
      // from(native)
      //   .pipe(finalize(() => c.dismiss()))
      //   .subscribe(
      //     (res) => {
      //       this.response = res;
      //       Swal.fire({
      //         title: '',
      //         text: 'Password Successfuly changed',
      //         icon: 'success',
      //         heightAuto: false,
      //       });
      //       this.router.navigate(['login']);
      //     },
      //     (error) => {
      //       this.errMsg = error;
      //       this.resp = JSON.parse(this.errMsg.error);
      //       this.msg = this.resp.message;

      //       Swal.fire({
      //         title: '',
      //         text: this.msg,
      //         icon: 'error',
      //         heightAuto: false,
      //       });
      //     }
      //   );
    });
  }
  backBtn() {
    //this.router.navigate(['..']);
    this.location.back();
  }
  get current_password() {
    return this.postData.get('current_password') as FormControl;
  }
  get Create_Password() {
    return this.postData.get('Create_Password') as FormControl;
  }
  get New_Password() {
    return this.postData.get('New_Password') as FormControl;
  }
}
