// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { LoadingController } from '@ionic/angular';
//  import { from } from 'rxjs';
// import { finalize } from 'rxjs/operators';
// import { ServiceService } from '../services/service.service';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-registration',
//   templateUrl: './registration.page.html',
//   styleUrls: ['./registration.page.scss'],
// })
// export class RegistrationPage implements OnInit {
//   private readonly TOKEN_user = 'bizlogicj';
//   private readonly eventIDs = 'event_id';
//   private readonly TOKEN_Cstomer = 'cstID';

//   posted_id: any;
//   user: any;
//   event_id: any;
//   response: any;
//   cust_reg_sno: any;
//   constructor(private router: Router, private loadingCtrl: LoadingController, private service: ServiceService) { }

//   ngOnInit() {
//    this.user= localStorage.getItem(this.TOKEN_user);
//    this.event_id = localStorage.getItem(this.eventIDs);
//    this.cust_reg_sno = localStorage.getItem(this.TOKEN_Cstomer);

//     this.posted_id = JSON.parse(this.user);
//      }
//   PostData ={
//     visitor_name:"",
//     no_of_persons:"",
//     table_number:"",
//     email_address:"",
//     mobile_no:""
//   }
//     saveData(){
//      const bodyparams = {
//       visitor_name:this.PostData.visitor_name,
//       no_of_persons: this.PostData.no_of_persons,
//       table_number: this.PostData.table_number,
//       email_address: this.PostData.email_address,
//       mobile_no: '255'+this.PostData.mobile_no,
//       card_state_mas_sno:"1",
//       event_det_sno: this.event_id,
//       cust_reg_sno: this.cust_reg_sno,
//       posted_by: this.posted_id
//     }
//       this.service.CustomerRegistration(bodyparams).subscribe
//      (
//       res=>{
//         this.response = res;
//         Swal.fire({
//           title: '',
//           text: this.response.response,
//           icon: 'success',
//           timer: 2000
//         });
//         this.router.navigate(['tabs/tab2'])
//         }
//     )
//   }
//   backBtn(){
//     this.router.navigate(['tabs/tab2'])
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiceService } from '../services/service.service';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  private readonly TOKEN_user = 'bizlogicj';
  private readonly eventIDs = 'event_id';
  private readonly TOKEN_Cstomer = 'cstID';
  formGroup!: FormGroup;
  posted_id: any;
  user: any;
  event_id: any;
  response: any;
  cust_reg_sno: any;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private service: ServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.user = localStorage.getItem(this.TOKEN_user);
    this.event_id = localStorage.getItem(this.eventIDs);
    this.cust_reg_sno = localStorage.getItem(this.TOKEN_Cstomer);

    this.posted_id = JSON.parse(this.user);
    this.createFormGroup();
  }
  private createFormGroup() {
    this.formGroup = this.fb.group({
      visitor_name: this.fb.control('', [Validators.required]),
      mobile_no: this.fb.control('', [Validators.required]),
      no_of_persons: this.fb.control('', [Validators.required]),
      table_number: this.fb.control('', []),
      email_address: this.fb.control('', [Validators.email]),
    });
  }
  PostData = {
    visitor_name: '',
    no_of_persons: '',
    table_number: '',
    email_address: '',
    mobile_no: '',
  };
  saveData() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const bodyparams = {
      // visitor_name: this.PostData.visitor_name,
      // no_of_persons: this.PostData.no_of_persons,
      // table_number: this.PostData.table_number,
      // email_address: this.PostData.email_address,
      // mobile_no: '255' + this.PostData.mobile_no,
      ...this.formGroup.value,
      card_state_mas_sno: '1',
      event_det_sno: this.event_id,
      cust_reg_sno: this.cust_reg_sno,
      posted_by: this.posted_id,
    };
    this.service.CustomerRegistration(bodyparams).subscribe((res) => {
      this.response = res;
      Swal.fire({
        title: '',
        text: this.response.response,
        icon: 'success',
        timer: 2000,
        heightAuto: false,
      });
      this.router.navigate(['tabs/tab2']);
    });
  }
  backBtn() {
    this.router.navigate(['tabs/tab2']);
  }
  get visitor_name() {
    return this.formGroup.get('visitor_name') as FormControl;
  }
  get mobile_no() {
    return this.formGroup.get('mobile_no') as FormControl;
  }
  get no_of_persons() {
    return this.formGroup.get('no_of_persons') as FormControl;
  }
  get table_number() {
    return this.formGroup.get('table_number') as FormControl;
  }
  get email_address() {
    return this.formGroup.get('email_address') as FormControl;
  }
}
