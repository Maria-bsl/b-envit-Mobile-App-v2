import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { BehaviorSubject, from, Subscription, zip } from 'rxjs';
import { finalize } from 'rxjs/operators';
// import { QrresultPage, userData } from '../qrresult/qrresult.page';
import { ServiceService } from '../services/service.service';
import { Chart } from 'chart.js';
import * as Highcharts from 'highcharts';
import { AppUtilities } from '../core/utils/app-utilities';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit {
  showingList: boolean = true;
  displayedColumns: string[] = [
    'Visitor Name',
    'Scanned',
    'Table No#',
    'Verified By',
  ];
  scanSub: any;
  qrText: string;
  userInfo: any;
  listOfInvitee: any;
  guestIn = 0;
  remains = 0;
  totalGuest = 0;
  totalVisitors$ = new BehaviorSubject<number>(0);
  eventname: string;
  //filterTerm: string;
  filterTerm = new FormControl('', []);
  scanActive: boolean;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  private readonly event_name = 'event_name';

  private readonly eventIDs = 'event_id';
  percen: any;
  percen2: any;
  inviteeArr: any;
  tableno: any;
  thead: string;
  Highcharts: typeof Highcharts = Highcharts;
  updateFromInput = false;
  subscriptions: Subscription[] = [];
  chart;
  chartConstructor = 'chart';
  chartCallback;
  chartOptions: Highcharts.Options = {
    credits: {
      enabled: false, //watch out for production
    },
    legend: {
      enabled: false,
    },
    chart: {
      height: 200,
      width: 200,
      backgroundColor: '#ffffff',
    },
    subtitle: {
      verticalAlign: 'middle',
      floating: true,
      text: 'Total',
      y: 36,
      style: {
        fontSize: '16px',
      },
    },
    series: [],
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private loadingCtrl: LoadingController,
    private service: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private qrScanner: QRScanner,
    public platform: Platform,
    private cdr: ChangeDetectorRef,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
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
    this.registerIcons(iconRegistry, sanitizer);
  }
  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.eventname = localStorage.getItem(this.event_name);
    this.verifycardlist();
    this.service.refreshNeeded$.subscribe(() => {
      this.verifycardlist();
    });

    const self = this;
    this.chartCallback = (chart) => {
      self.chart = chart;
    };

    this.filterTerm.valueChanges.subscribe({
      next: (searchText) => {
        this.dataSource.filter = searchText.trim().toLocaleLowerCase();
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
    });
  }
  private registerIcons(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    // iconRegistry.addSvgIcon(
    //   'list',
    //   sanitizer.bypassSecurityTrustResourceUrl('/assets/feather/list.svg')
    // );
    let icons = ['list', 'grid'];
    icons.forEach((icon) => {
      iconRegistry.addSvgIcon(
        `${icon}`,
        sanitizer.bypassSecurityTrustResourceUrl(`/assets/feather/${icon}.svg`)
      );
    });
  }
  private dataSourceFilter() {
    let filterPredicate = (data: any, filter: string) => {
      return data.visitor_name
        .toLocaleLowerCase()
        .includes(filter.toLocaleLowerCase());
    };
    this.dataSource.filterPredicate = filterPredicate;
  }
  private parseInviteeChecked(inviteeChecked: Object) {
    this.inviteeArr = inviteeChecked;
    this.listOfInvitee = this.inviteeArr.verified_invitees;
    for (let i = 0; i <= this.listOfInvitee; i++) {
      this.tableno = this.listOfInvitee[i].table_number;
    }
    this.guestIn = this.inviteeArr.number_of_verified_invitees;
    this.dataSource = new MatTableDataSource(this.listOfInvitee);
    this.dataSourceFilter();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  private parseGetAllInvitees(getAllinvitee: Object) {
    this.inviteeArr = getAllinvitee;
    this.totalGuest = this.inviteeArr.totalVisitor;
  }
  private updateChartOptions() {
    const self = this,
      chart = this.chart;
    self.chartOptions.title = {
      verticalAlign: 'middle',
      floating: true,
      text: `${this.totalGuest}`,
      //y: -2,
      style: {
        fontSize: '24px',
      },
    };
    self.chartOptions.series = [
      {
        type: 'pie',
        dataLabels: {
          connectorWidth: 0,
        },
        data: [
          { y: this.guestIn, color: '#2dd36f', name: '' },
          {
            y: this.remains,
            color: '#eb445a',
            name: '',
          },
        ],
        innerSize: '80%',
      },
    ];
    self.updateFromInput = true;
  }
  private verifycardlist() {
    AppUtilities.startLoading(this.loadingCtrl).then((loading) => {
      let inviteeChecked$ = from(this.service.inviteeChecked(this.userInfo));
      let getAllinvitee$ = from(this.service.getAllinvitee(this.userInfo));
      let observables = zip(inviteeChecked$, getAllinvitee$);
      observables.pipe(finalize(() => loading.dismiss())).subscribe({
        next: (res) => {
          let [inviteeChecked, getAllinvitee] = res;
          this.parseInviteeChecked(inviteeChecked);
          this.parseGetAllInvitees(getAllinvitee);
          this.remains = this.totalGuest - this.guestIn;
          this.percen = (this.guestIn / this.totalGuest) * 100;
          this.percen2 = (this.remains / this.totalGuest) * 100;
          this.updateChartOptions();
        },
        error: (err) => {},
      });
    });
  }
  // startScanning() {
  //   // Optionally request the permission early
  //   this.qrScanner.prepare().then((status: QRScannerStatus) => {
  //     if (status.authorized) {
  //       this.qrScanner.show();
  //       this.scanSub = document.getElementsByTagName('body')[0].style.opacity =
  //         '0';
  //       // debugger

  //       this.scanSub = this.qrScanner
  //         .scan()

  //         .subscribe(
  //           (textFound: string) => {
  //             document.getElementsByTagName('body')[0].style.opacity = '1';

  //             this.qrScanner.hide();
  //             // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //             this.qrScanner.destroy();
  //             // this.qrScanner.unsubscribe();
  //             this.qrText = textFound;
  //             // this.openModal(this.qrText);
  //             this.sendResult(this.qrText);
  //           },
  //           (err) => {
  //             alert(JSON.stringify(err));
  //           }
  //         );
  //       // this.scanActive =true;
  //     } else if (status.denied) {
  //       this.qrScanner.hide();
  //     } else {
  //     }
  //   });
  // }
  startScanning() {
    let body = document.getElementsByTagName('body')[0];
    //Optionally request the permission early
    this.qrScanner
      .prepare()
      .then((status) => {
        if (status.denied) {
          this.qrScanner.hide();
        } else if (status.authorized) {
          this.qrScanner.show();
          body.style.opacity = '0';
          this.scanSub = this.qrScanner.scan().subscribe({
            next: (textFound) => {
              body.style.opacity = '1';
              this.qrScanner.hide();
              this.qrScanner.destroy();
              if (this.scanSub) {
                this.scanSub.unsubscribe();
              }
              this.qrText = textFound;
              this.sendResult(this.qrText);
            },
          });
        }
      })
      .catch((err) => {
        throw err;
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
  getInviteeScanStatusColor(statusString: string): string {
    if (!statusString) return;
    let fractionPart = statusString.split(' ')[0];
    let [numerator, denominator] = fractionPart.split('/').map(Number);
    return numerator === denominator
      ? 'complete-scan-status'
      : 'pending-scan-status';
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
  async doRefresh(event) {
    this.verifycardlist();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
