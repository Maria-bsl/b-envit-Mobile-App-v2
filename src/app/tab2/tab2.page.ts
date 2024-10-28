// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
// import { LoadingController } from '@ionic/angular';
// import { from } from 'rxjs';
// import { finalize } from 'rxjs/operators';
//  import Swal from 'sweetalert2';
//  import { ServiceService } from '../services/service.service';

// @Component({
//   selector: 'app-tab2',
//   templateUrl: 'tab2.page.html',
//   styleUrls: ['tab2.page.scss']
// })
// export class Tab2Page implements OnInit {
//   userInfo: any;
//   listOfInvitee: any;
//   guestIn: any;
//   eventname: string;

//   // eslint-disable-next-line @typescript-eslint/naming-convention
//   event_id: any;
//   filterTerm: string;
//   private readonly eventIDs = 'event_id';
//   // eslint-disable-next-line @typescript-eslint/naming-convention
//   private readonly event_name = 'event_name';

//   private readonly totalVisitor = 'totalVisitor';
//   result: any;
//   qrResponse: any;
//   errMsg: any;
//   resp: any;
//   msg: any;
//   inviteeArr: any
//   // eslint-disable-next-line max-len
//   constructor(private service: ServiceService, private loadingCtrl: LoadingController, private router: Router, private route: ActivatedRoute) {
//   }
//   async ngOnInit() {
//     this.eventname = localStorage.getItem(this.event_name);

//     this.event_id = localStorage.getItem(this.eventIDs);
//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     const body = { event_id: this.event_id };
//     const loading = await this.loadingCtrl.create({
//       message: '',
//       spinner: 'lines-small'
//     });
//     loading.present();
//     const native = this.service.getAllinvitee(body.event_id);
//     from(native).pipe(
//       finalize(() => loading.dismiss()))
//       .subscribe
//       (
//         res => {
//           this.inviteeArr = res;
//           this.listOfInvitee = this.inviteeArr.visitors;
//           // this.guestIn = this.inviteeArr.invitees_count;
//            }
//       );
//   }
//   async sendQr(qrcode: any) {
//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     const body = { qr_code: qrcode, event_id: this.event_id };
//     console.log(JSON.stringify(body), 'qrcode entered');
//     const loading = await this.loadingCtrl.create({
//       message: 'please wait...',
//       spinner: 'lines-small'
//     });
//     await loading.present();
//     const native = this.service.sendQr(body);
//     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
//     from(native).pipe(
//       finalize(() => loading.dismiss()))
//       .subscribe(
//         res => {
//           this.result = res;
//           this.qrResponse = this.result;
//           console.log(JSON.stringify(this.result),"response")
//           if (this.result.message) {
//             Swal.fire({
//               title: '',
//               text: this.result.message,
//               icon: 'error'
//             });
//           } else if (this.qrResponse) {
//             const navigationExtras: NavigationExtras = {
//               state: {
//                 qrinfo: this.qrResponse,
//                 qrcode: qrcode
//               }
//             };
//             this.router.navigate(['tabs/verifyuser'], navigationExtras);
//           }

//         },
//          error=>{
//           this.errMsg = error;
//            this.resp = this.errMsg.error;
//           this.msg = this.resp.message

//           Swal.fire({
//             title: '',
//             text: this.msg,
//             icon: 'error'
//           });
//            console.log(JSON.stringify(error), "erorr found")
//          }
//       );

//     }
//     addInvitees(){
//       this.router.navigate(['registration'])
//     }

// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ServiceService } from '../services/service.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { inOutAnimation } from '../core/shared/fade-in-out-animation';
import { AppUtilities } from '../core/utils/app-utilities';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  animations: [inOutAnimation],
})
export class Tab2Page implements OnInit {
  showingList: boolean = true;
  userInfo: any;
  listOfInvitee: any;
  guestIn: any;
  eventname: string;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  event_id: any;
  filterTerm: string;
  private readonly eventIDs = 'event_id';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly event_name = 'event_name';

  private readonly totalVisitor = 'totalVisitor';
  result: any;
  qrResponse: any;
  errMsg: any;
  resp: any;
  msg: any;
  inviteeArr: any;
  // eslint-disable-next-line max-len
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  tableLoading: boolean = false;
  searchInput: FormControl = new FormControl('', []);
  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private service: ServiceService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  private dataSourceFilter() {
    let filterPredicate = (data: any, filter: string) => {
      return (
        data.visitor_name
          .toLocaleLowerCase()
          .includes(filter.toLocaleLowerCase()) ||
        data.mobile_no.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
      );
    };
    this.dataSource.filterPredicate = filterPredicate;
  }
  private searchInputChanged() {
    this.searchInput.valueChanges.subscribe({
      next: (searchText) => {
        this.dataSource.filter = searchText.trim().toLocaleLowerCase();
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
    });
  }
  async ngOnInit() {
    this.requestInviteesList();
    this.searchInputChanged();
  }
  requestInviteesList() {
    this.eventname = localStorage.getItem(this.event_name);
    this.event_id = localStorage.getItem(this.eventIDs);
    const body = { event_id: this.event_id };
    AppUtilities.startLoading(this.loadingCtrl).then((loading) => {
      this.service
        .getAllinvitee(body.event_id)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe({
          next: (res) => {
            this.inviteeArr = res;
            this.listOfInvitee = this.inviteeArr.visitors;
            this.dataSource = new MatTableDataSource(this.listOfInvitee);
            this.tableLoading = false;
            this.dataSourceFilter();
          },
        });
    });
  }
  async sendQr(qrcode: any) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const body = { qr_code: qrcode, event_id: this.event_id };
    console.log(JSON.stringify(body), 'qrcode entered');
    const loading = await this.loadingCtrl.create({
      message: 'please wait...',
      spinner: 'lines-small',
    });
    await loading.present();
    const native = this.service.sendQr(body);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    from(native)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        (res) => {
          this.result = res;
          this.qrResponse = this.result;
          console.log(JSON.stringify(this.result), 'response');
          if (this.result.message) {
            // Swal.fire({
            //   title: '',
            //   text: this.result.message,
            //   icon: 'error',
            // });
            AppUtilities.showErrorMessage('', this.result.message);
          } else if (this.qrResponse) {
            const navigationExtras: NavigationExtras = {
              state: {
                qrinfo: this.qrResponse,
                qrcode: qrcode,
              },
            };
            this.router.navigate(['tabs/verifyuser'], navigationExtras);
          }
        },
        (error) => {
          this.errMsg = error;
          this.resp = this.errMsg.error;
          this.msg = this.resp.message;
          AppUtilities.showErrorMessage('', this.msg);
          console.log(JSON.stringify(error), 'erorr found');
        }
      );
  }
  async doRefresh(event) {
    //this.verifycardlist();
    this.requestInviteesList();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  addInvitees() {
    this.router.navigate(['registration']);
  }
  changepass() {
    this.router.navigate(['changepwd']);
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
  switchEvent() {
    this.router.navigate(['switch']);
  }
}
