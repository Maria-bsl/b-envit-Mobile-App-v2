import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-changepwd',
  templateUrl: './changepwd.page.html',
  styleUrls: ['./changepwd.page.scss'],
})
export class ChangepwdPage implements OnInit {
  private readonly TOKEN_NAME = 'profanis_auth';
  datas: any;
  mobileNumber: any;
  response: any;
  errMsg: any;
  resp: any;
  msg: any;
  constructor(private router: Router, private service: ServiceService, private loadingCtrl: LoadingController) { }
  postData = {
    current_password: '',
    New_Password: ''
  }
  ngOnInit() {
    this.datas = localStorage.getItem(this.TOKEN_NAME);
   const convertion = JSON.parse(this.datas);

   this.mobileNumber = convertion.mobile;
   }

  async changPass(){
    const loading = await this.loadingCtrl.create({
      // message: 'please wait...',
      spinner: 'lines-small'
    });
    await loading.present();
     const body = {mobile_number:this.mobileNumber, current_password: this.postData.current_password,New_Password:this.postData.New_Password}
      let native = this.service.ChangePswd(body);
     from(native).pipe(
      finalize(()=> loading.dismiss()))
      .subscribe(
        res=>{
          this.response = res
          Swal.fire({
            title: '',
            text: 'Password Successfuly changed',
            icon: 'success'
          });
          this.router.navigate(['login']);
     
         },
        error=>{
          this.errMsg = error;
         this.resp = JSON.parse(this.errMsg.error); 
         this.msg = this.resp.message
        
         Swal.fire({
           title: '',
           text: this.msg,
           icon: 'error'
         });
         }
      )
   }
   backBtn(){
     this.router.navigate(['tabs/dashboard']);
   }
  

}
