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

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-changepwd',
  templateUrl: './changepwd.page.html',
  styleUrls: ['./changepwd.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ChangepwdPage implements OnInit {
  private readonly TOKEN_NAME = 'profanis_auth';
  datas: any;
  mobileNumber: any;
  response: any;
  errMsg: any;
  resp: any;
  msg: any;
  language: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ServiceService,
    private loadingCtrl: LoadingController,
    private location: Location,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService
  ) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }
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
          AppUtilities.showErrorMessage('', err.error.Message);
        },
      });
    });
  }
  backBtn() {
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
