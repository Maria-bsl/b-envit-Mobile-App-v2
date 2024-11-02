import { Component, OnInit } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { Router, RouterModule } from '@angular/router';
import { AppUtilities } from 'src/app/core/utils/app-utilities';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { SelectLanguageDialogComponent } from '../../dialogs/select-language-dialog/select-language-dialog.component';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    MatDialogModule,
  ],
})
export class NavbarComponent implements OnInit {
  language: any;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private location: Location
  ) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }
  private changeLanguage(code: string) {
    if (this.language !== code) {
      AppUtilities.startLoading(this.loadingCtrl).then((loading) => {
        loading.dismiss();
        this.language = code;
        this.translateConfigService.setLanguage(code);
        this.translate.get('navbar.selectLanguage.successChange').subscribe({
          next: (message) => {
            AppUtilities.showSuccessToast(message);
          },
        });
      });
    }
  }
  ngOnInit() {}
  changepass() {
    this.router.navigate(['changepwd']);
  }
  switchEvent() {
    this.router.navigate(['switch']);
  }
  openChangePassword() {
    let dialogRef = this.dialog.open(SelectLanguageDialogComponent, {
      data: {
        language: this.language,
      },
      disableClose: false,
    });
    dialogRef.componentInstance.languageChange.asObservable().subscribe({
      next: (value) => {
        this.changeLanguage(value.language);
        dialogRef.close();
      },
    });
  }
  logoClicked() {
    if (this.router.url === '/switch') {
    } else {
      this.router.navigate(['/tabs/dashboard']);
    }
  }
  logout() {
    AppUtilities.startLoading(this.loadingCtrl).then((loading) => {
      localStorage.clear();
      setTimeout(() => {
        loading.dismiss();
        this.router.navigate(['login']).then((c) => {
          location.reload();
        });
      }, 1500);
    });
  }
}
