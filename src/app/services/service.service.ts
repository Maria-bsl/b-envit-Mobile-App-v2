import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Login } from './params/login';
import { HTTP } from '@ionic-native/http/ngx';
import { EventChoice } from './params/eventschoice';
import { QrCode } from './params/qrcode';
import { QrVerify } from './params/verify';
import { EventID } from './params/eventid';
 @Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly TOKEN_NAME = 'profanis_auth';

  private _refreshNeeded$ = new Subject<void>();
  datas: any;
   IP: any;
  get refreshNeeded$(){
    return this._refreshNeeded$;
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
 base_urls = "https://bizlogicsolutions.co.in:99";
  // base_urls = "http://192.168.100.50:99";
  constructor(private https: HttpClient, private http: HTTP) {
   }
 
  loginFunc(login) {
     return this.https.post(this.base_urls+"/api/login", login
     );
  }
   
  EventChoices(choice: EventChoice) {
     return this.https.post(this.base_urls +"/api/event-of-choice", choice,
      // eslint-disable-next-line @typescript-eslint/naming-convention
     );
  }
  sendQr(qr: QrCode) {
    this._refreshNeeded$.next();
    try{
      return this.https.post(this.base_urls +"/api/read-qr-code", qr,
      );
    }catch{
      this._refreshNeeded$.next();
    }
  }
  verifyQr(verify: QrVerify) {
    try {
      return this.https.post(this.base_urls +"/api/invitees-verification", verify,);
    } catch{
      this._refreshNeeded$.next();
    }
  }
  inviteeChecked(eventId) {
      return this.https.get(this.base_urls +"/api/checked-in-invitees/" + eventId
         , {},);   
  }
  getAllinvitee(eventId) {
    try {
      return this.https.get(this.base_urls +"/api/invitees/" + eventId
         , {},);
    } catch {
      this._refreshNeeded$.next();
    }
  }
  Forgetpwd(Mob_num) {
    return this.https.post(this.base_urls +"/api/forgot-password", {mobile_number:Mob_num},
      // eslint-disable-next-line @typescript-eslint/naming-convention
     );
  }
  ChangePswd(data) {
    return this.https.post(this.base_urls +"/api/change-password",
     {mobile_number:data.mobile_number, current_password: data.current_password,New_Password:data.New_Password},
      // eslint-disable-next-line @typescript-eslint/naming-convention
       );
  }
 
  CustomerRegistration(data: any){
    return this.https.post(this.base_urls +"/api/invitees/register",
    data);
  }
}