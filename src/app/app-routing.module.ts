import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardPageModule),
  },
  {
    path: 'eventselection',
    loadChildren: () =>
      import('./eventselection/eventselection.module').then(
        (m) => m.EventselectionPageModule
      ),
  },
  {
    path: 'verifyuser',
    loadChildren: () =>
      import('./verifyuser/verifyuser.module').then(
        (m) => m.VerifyuserPageModule
      ),
  },
  {
    path: 'qrpage',
    loadChildren: () =>
      import('./qrpage/qrpage.module').then((m) => m.QrpagePageModule),
  },
  {
    path: 'recoverpwd',
    loadChildren: () =>
      import('./recoverpwd/recoverpwd.module').then(
        (m) => m.RecoverpwdPageModule
      ),
  },
  {
    path: 'changepwd',
    loadChildren: () =>
      import('./changepwd/changepwd.module').then((m) => m.ChangepwdPageModule),
  },

  {
    path: 'splashscreen',
    loadChildren: () =>
      import('./splashscreen/splashscreen.module').then(
        (m) => m.SplashscreenPageModule
      ),
  },

  {
    path: 'pricing',
    loadChildren: () =>
      import('./pricing/pricing.module').then((m) => m.PricingPageModule),
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./registration/registration.module').then(
        (m) => m.RegistrationPageModule
      ),
  },
  {
    path: 'switch',
    loadChildren: () =>
      import('./switch-event/switch-event.module').then(
        (m) => m.SwitchEventModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
