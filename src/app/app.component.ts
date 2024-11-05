import { Component, EnvironmentInjector } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private splashScreen: SplashScreen,
    private platform: Platform,
    private router: Router
  ) {
    //this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.router.navigateByUrl('splashscreen');
      setTimeout(() => {
        this.router.navigateByUrl('login');
      }, 2500);
    });
  }
}
