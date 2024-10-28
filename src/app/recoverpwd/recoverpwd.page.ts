// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { IonicModule, LoadingController } from '@ionic/angular';
// import { from } from 'rxjs';
// import { finalize } from 'rxjs/operators';
// import Swal from 'sweetalert2';
// import { ServiceService } from '../services/service.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { RecoverpwdPageRoutingModule } from './recoverpwd-routing.module';

// @Component({
//   selector: 'app-recoverpwd',
//   templateUrl: './recoverpwd.page.html',
//   styleUrls: ['./recoverpwd.page.scss'],
// })
// export class RecoverpwdPage implements OnInit {
//   response: any;

//   constructor(
//     private service: ServiceService,
//     private router: Router,
//     private loadingCtrl: LoadingController
//   ) {}
//   PostData = {
//     mobile_number: '',
//   };
//   ngOnInit() {}
//   async forgetpwd() {
//     const loading = await this.loadingCtrl.create({
//       // message: '',
//       spinner: 'bubbles',
//     });
//     await loading.present();
//     const body = { mobile_number: '0' + this.PostData.mobile_number };
//     let native = this.service.Forgetpwd(body.mobile_number);
//     from(native)
//       .pipe(finalize(() => loading.dismiss()))
//       .subscribe((res) => {
//         this.response = res;
//         if (this.response.status == 1) {
//           Swal.fire({
//             title: '',
//             text: 'Credentials has been sent to your mobile number.',
//             icon: 'success',
//           });
//           this.router.navigate(['login']);
//         } else {
//           Swal.fire({
//             title: '',
//             text: 'Invalid mobile number',
//             icon: 'error',
//           });
//         }
//       }),
//       (error) => {};
//   }
//   loginpage() {
//     this.router.navigate(['login']);
//   }
// }

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ServiceService } from '../services/service.service';
import { AppUtilities } from '../core/utils/app-utilities';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-recoverpwd',
  templateUrl: './recoverpwd.page.html',
  styleUrls: ['./recoverpwd.page.scss'],
})
export class RecoverpwdPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  response: any;
  PostData!: FormGroup;
  constructor(
    private service: ServiceService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder
  ) {}
  private createPostDataFormGroup() {
    this.PostData = this.fb.group({
      mobile_number: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^0[67]\d{8}$/),
      ]),
    });
  }
  ngOnInit() {
    this.createPostDataFormGroup();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  private async forgetpwd(mobileNumber: string) {
    AppUtilities.startLoading(this.loadingCtrl).then((loading) => {
      this.subscriptions.push(
        this.service
          .Forgetpwd(mobileNumber)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe({
            next: (res: { status: number }) => {
              if (res.status == 1) {
                AppUtilities.showSuccessMessage(
                  '',
                  'Credentials have been sent to your mobile number.'
                );
                this.router.navigate(['login']);
              } else {
                AppUtilities.showErrorMessage('', 'Invalid mobile number');
              }
            },
            error: (err) => {
              AppUtilities.showErrorMessage(
                '',
                'An error occurred. Please try again.'
              );
            },
          })
      );
    });
  }
  loginpage() {
    this.router.navigate(['login']);
  }
  onResetPasswordClicked() {
    if (this.mobile_number.valid) {
      this.forgetpwd(this.mobile_number.value);
    } else {
      this.mobile_number.markAllAsTouched();
    }
  }
  get mobile_number() {
    return this.PostData.get('mobile_number') as FormControl;
  }
}
