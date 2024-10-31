import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiceService } from '../services/service.service';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppUtilities } from '../core/utils/app-utilities';
import { Location } from '@angular/common';

import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class RegistrationPage implements OnInit, OnDestroy {
  private readonly TOKEN_user = 'bizlogicj';
  private readonly eventIDs = 'event_id';
  private readonly TOKEN_Cstomer = 'cstID';
  subscriptions: Subscription[] = [];
  formGroup!: FormGroup;
  posted_id: any;
  user: any;
  event_id: any;
  response: any;
  cust_reg_sno: any;
  language: any;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private service: ServiceService,
    private fb: FormBuilder,
    private location: Location,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService
  ) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }
  ngOnInit() {
    this.user = localStorage.getItem(this.TOKEN_user);
    this.event_id = localStorage.getItem(this.eventIDs);
    this.cust_reg_sno = localStorage.getItem(this.TOKEN_Cstomer);

    this.posted_id = JSON.parse(this.user);
    this.createFormGroup();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
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
      ...this.formGroup.value,
      card_state_mas_sno: '1',
      event_det_sno: this.event_id,
      cust_reg_sno: this.cust_reg_sno,
      posted_by: this.posted_id,
    };
    AppUtilities.startLoading(this.loadingCtrl).then((loading) => {
      this.subscriptions.push(
        this.service
          .CustomerRegistration(bodyparams)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe({
            next: (res) => {
              this.response = res;
              AppUtilities.showSuccessMessage('', this.response.response);
              this.router.navigate(['tabs/tab2']);
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
  backBtn() {
    this.location.back();
    //this.router.navigate(['tabs/tab2']);
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
