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
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-recoverpwd',
  templateUrl: './recoverpwd.page.html',
  styleUrls: ['./recoverpwd.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslateModule,
  ],
})
export class RecoverpwdPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  response: any;
  PostData!: FormGroup;
  language: any;
  constructor(
    private service: ServiceService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService
  ) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }
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
