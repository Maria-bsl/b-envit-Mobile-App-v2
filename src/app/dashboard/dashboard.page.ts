import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
// import { QrresultPage, userData } from '../qrresult/qrresult.page';
import { ServiceService } from '../services/service.service';
import { Chart } from 'chart.js';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit {
  scanSub: any;
  qrText: string;
  userInfo: any;
  listOfInvitee: any;
  guestIn = 0;
  remains = 0;
  totalGuest = 0;
  //totalVisitors = signal
  eventname: string;
  filterTerm: string;
  scanActive: boolean;

  public activity;
  public xData;
  public label;
  options: any;

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly event_name = 'event_name';

  private readonly eventIDs = 'event_id';
  percen: any;
  percen2: any;
  inviteeArr: any;
  tableno: any;
  thead: string;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    credits: {
      enabled: false, //watch out for production
    },
    chart: {
      height: 200,
      width: 200,
      backgroundColor: 'transparent',
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      text: `${this.totalGuest}`,
      y: -2,
      style: {
        fontSize: '24px',
      },
    },
    subtitle: {
      verticalAlign: 'middle',
      floating: true,
      text: 'Total',
      y: 16,
      style: {
        fontSize: '16px',
      },
    },
    series: [
      {
        type: 'pie',
        data: [
          { y: 150, color: '#2dd36f', name: 'In' },
          {
            y: 50,
            color: '#eb445a',
            name: 'Remaining',
          },
        ],
        innerSize: '80%',
      },
    ],
  };
  //@ViewChild('chartCol') chartCol!: any;
  ngAfterViewInit(): void {
    //let el = this.chartCol.el as ElementRef;
    //console.log(el.nativeElement);
    //console.log(el.nativeElement.offsetWidth);
    //console.log(this.chartCol.el);
  }
  constructor(
    private loadingCtrl: LoadingController,
    private service: ServiceService,
    // eslint-disable-next-line max-len
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private qrScanner: QRScanner,
    public platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(0, () => {
      document.getElementsByTagName('body')[0].style.opacity = '1';
      this.scanSub.unsubscribe();
    });
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.userInfo =
          this.router.getCurrentNavigation().extras.state.data_from_user;
        localStorage.setItem(this.eventIDs, this.userInfo);
        console.log(JSON.stringify(this.userInfo), 'Event Id');
      }
    });
  }
  ngOnInit() {
    this.verifycardlist();
    this.service.refreshNeeded$.subscribe(() => {
      this.verifycardlist();
    });
  }

  async verifycardlist() {
    this.eventname = localStorage.getItem(this.event_name);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const body = { event_id: this.userInfo };
    const loading = await this.loadingCtrl.create({
      message: 'please wait...',
      spinner: 'lines-small',
    });
    const native = this.service.inviteeChecked(body.event_id);
    from(native)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((res) => {
        this.inviteeArr = res;
        this.listOfInvitee = this.inviteeArr.verified_invitees;
        for (let i = 0; i <= this.listOfInvitee; i++) {
          this.tableno = this.listOfInvitee[i].table_number;
        }

        this.guestIn = this.inviteeArr.number_of_verified_invitees;
      });

    const body2 = { event_id: this.userInfo };
    const loading2 = await this.loadingCtrl.create({
      message: 'please wait...',
      spinner: 'lines-small',
    });
    const native2 = this.service.getAllinvitee(body2.event_id);
    from(native2)
      .pipe(finalize(() => loading2.dismiss()))
      .subscribe((result) => {
        this.inviteeArr = result;
        this.totalGuest = this.inviteeArr.totalVisitor;
      });
    this.remains = this.totalGuest - this.guestIn;
    this.percen = (this.guestIn / this.totalGuest) * 100;
    this.percen2 = (this.remains / this.totalGuest) * 100;
  }
  showChart() {
    var ctx = (<any>document.getElementById('yudhatp-chart')).getContext('2d');

    var chart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [
          {
            label: 'attendance chart',
            backgroundColor: ['#284f99', 'rgb(159, 196, 85)'],
            borderColor: ['#284f99', 'rgba(54,162,235,1)'],
            data: [this.percen, this.percen2],
            borderWidth: 2,
          },
        ],
        labels: ['Checked In', 'Invitee Remains'],
      },
    });
  }
  startScanning() {
    // Optionally request the permission early
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        this.qrScanner.show();
        this.scanSub = document.getElementsByTagName('body')[0].style.opacity =
          '0';
        // debugger

        this.scanSub = this.qrScanner
          .scan()

          .subscribe(
            (textFound: string) => {
              document.getElementsByTagName('body')[0].style.opacity = '1';

              this.qrScanner.hide();
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              this.qrScanner.destroy();
              // this.qrScanner.unsubscribe();
              this.qrText = textFound;
              // this.openModal(this.qrText);
              this.sendResult(this.qrText);
            },
            (err) => {
              alert(JSON.stringify(err));
            }
          );
        // this.scanActive =true;
      } else if (status.denied) {
        this.qrScanner.hide();
      } else {
      }
    });
  }
  sendResult(qrText: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        result: qrText,
      },
    };
    this.router.navigate(['qrpage'], navigationExtras);
  }
  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }
  changepass() {
    this.router.navigate(['changepwd']);
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
  async doRefresh(event) {
    this.verifycardlist();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
