import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ServiceService } from '../services/service.service';
import { AppUtilities } from '../core/utils/app-utilities';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verifyuser',
  templateUrl: './verifyuser.page.html',
  styleUrls: ['./verifyuser.page.scss'],
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule,
  ],
})
export class VerifyuserPage implements OnInit, OnDestroy {
  MAX_INVITES_FOR_SELECT = 1;
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
  private readonly visitorId = 'visitorID';
  private readonly eventIDs = 'event_id';
  event_id: string;
  errMsg: any;
  resp: any;
  msg: any;
  count: any;
  postData!: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private service: ServiceService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.eventname = localStorage.getItem(this.event_name);
    this.event_id = localStorage.getItem(this.eventIDs);
    this.createPostDataFormGroup();
    this.subscriptions.push(
      this.route.queryParams.subscribe({
        next: (params) => {
          if (this.router.getCurrentNavigation().extras.state) {
            this.qrinfo =
              this.router.getCurrentNavigation().extras.state.qrinfo;
            this.qrcode =
              this.router.getCurrentNavigation().extras.state.qrcode;
            this.count = Array.from(
              { length: this.qrinfo.unchecked_invitee },
              (_, i) => i + 1
            );
          }
          if (this.qrinfo.unchecked_invitee === 1) {
            this.Number_Of_CheckingIn_Invitees.setValue(1);
            this.verifyuser();
          }
        },
      })
    );
    this.subscriptions.at(this.subscriptions.length - 1);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  private maxInviteesValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    if (Number(value) > 2) {
      return { maximumExceeded: true };
    }
    return null;
  }
  private createPostDataFormGroup() {
    this.postData = this.fb.group({
      Number_Of_CheckingIn_Invitees: this.fb.control('', [
        Validators.required,
        this.maxInviteesValidator,
      ]),
    });
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
  getAvailableNumberOfInvitees() {
    return Array.from(
      { length: this.qrinfo.unchecked_invitee },
      (_, i) => i + 1
    );
  }
  allClear() {
    // this.result = '';
    this.input = '';
  }
  verifyuser() {
    if (this.postData.invalid) {
      return;
    }
    this.userId = localStorage.getItem(AppUtilities.TOKEN_user);
    this.visitor_id = this.qrinfo.visitor_id;
    const qrcode = this.qrcode;
    const params = {
      event_id: this.event_id,
      qr_code: qrcode,
      Number_Of_CheckingIn_Invitees: this.Number_Of_CheckingIn_Invitees.value,
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
      })
      .catch((err) => {
        throw err;
      });
  }
  get Number_Of_CheckingIn_Invitees() {
    return this.postData.get('Number_Of_CheckingIn_Invitees') as FormControl;
  }
}
