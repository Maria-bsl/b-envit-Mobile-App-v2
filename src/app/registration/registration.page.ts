import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
 import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiceService } from '../services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  private readonly TOKEN_user = 'bizlogicj';
  private readonly eventIDs = 'event_id';
  private readonly TOKEN_Cstomer = 'cstID';

  posted_id: any;
  user: any;
  event_id: any;
  response: any;
  cust_reg_sno: any;
  constructor(private router: Router, private loadingCtrl: LoadingController, private service: ServiceService) { }

  ngOnInit() {
   this.user= localStorage.getItem(this.TOKEN_user);
   this.event_id = localStorage.getItem(this.eventIDs);
   this.cust_reg_sno = localStorage.getItem(this.TOKEN_Cstomer);

    this.posted_id = JSON.parse(this.user);
     }
  PostData ={
    visitor_name:"",
    no_of_persons:"",
    table_number:"",
    email_address:"",
    mobile_no:""
  }
    saveData(){
     const bodyparams = {
      visitor_name:this.PostData.visitor_name,
      no_of_persons: this.PostData.no_of_persons,
      table_number: this.PostData.table_number,
      email_address: this.PostData.email_address,
      mobile_no: '255'+this.PostData.mobile_no,
      card_state_mas_sno:"1",
      event_det_sno: this.event_id,
      cust_reg_sno: this.cust_reg_sno,
      posted_by: this.posted_id 
    }
      this.service.CustomerRegistration(bodyparams).subscribe
     (
      res=>{
        this.response = res;
        Swal.fire({
          title: '',
          text: this.response.response,
          icon: 'success',
          timer: 2000
        });
        this.router.navigate(['tabs/tab2'])
        }
    )
  }
  backBtn(){
    this.router.navigate(['tabs/tab2'])
  }
}

 