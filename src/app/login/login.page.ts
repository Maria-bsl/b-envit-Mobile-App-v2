import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ServiceService } from '../service/service.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventselectionPage } from '../eventselection/eventselection.page';
import { IonicModule, LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { ServiceService } from '../services/service.service';
import Swal from 'sweetalert2';

import { finalize, first } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { LoginPayload } from '../core/entities/login-payload';
import { AppUtilities } from '../core/utils/app-utilities';
import { LoginResponse } from '../core/response/LoginResponse';
import { EventDetailsResponse } from '../core/response/EventDetailsResponse';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDialogModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private dialog: MatDialog,
    private router: Router,
    private service: ServiceService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.createLoginFormGroup();
    this.registerIcons(iconRegistry, sanitizer);
  }
  private createLoginFormGroup() {
    this.loginForm = this.fb.group({
      mobile_number: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^0[67]\d{8}$/),
      ]),
      password: this.fb.control('', [Validators.required]),
      ip_address: this.fb.control('', []),
    });
  }
  private registerIcons(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'lock',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/feather/lock.svg')
    );
  }
  private parseLoginResponse(res: LoginResponse) {
    localStorage.setItem(
      AppUtilities.TOKEN_NAME,
      JSON.stringify({ mobile: res.Mobile_Number })
    );
    if (res.event_details && res.event_details.length > 0) {
      this.router.navigateByUrl('switch', {
        state: { data: res.event_details },
      });
      //this.openDialog(res.event_details);
    } else {
      AppUtilities.showErrorMessage('Failed', res.message);
      this.router.navigate(['login']);
    }
  }
  async onClickLogin() {
    if (this.loginForm.valid) {
      let form = this.loginForm.value as LoginPayload;
      AppUtilities.startLoading(this.loadingCtrl)
        .then((c) => {
          this.service
            .loginFunc(form)
            .pipe(finalize(() => c.dismiss()))
            .subscribe({
              next: (res: LoginResponse) => {
                this.parseLoginResponse(res);
              },
              error: (err: HttpErrorResponse) => {
                AppUtilities.showErrorMessage(
                  'Login failed',
                  err.error.message
                );
                this.router.navigate(['login']);
              },
            });
        })
        .catch((err) => {
          throw err;
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  openDialog(eventDetails: EventDetailsResponse[]) {
    const dialogRef = this.dialog.open(EventselectionPage, {
      data: eventDetails,
      disableClose: true,
    });
  }
  resetpage() {
    this.router.navigate(['recoverpwd']);
  }
  tryevent() {
    this.router.navigate(['pricing']);
  }
  ngOnInit() {}
  get mobile_number() {
    return this.loginForm.get('mobile_number') as FormControl;
  }
  get password() {
    return this.loginForm.get('password') as FormControl;
  }
  get ip_address() {
    return this.loginForm.get('ip_address') as FormControl;
  }
}
