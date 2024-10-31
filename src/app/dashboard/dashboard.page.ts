import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { IonicModule, LoadingController, Platform } from '@ionic/angular';
import { BehaviorSubject, from, Subscription, zip } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiceService } from '../services/service.service';
import * as Highcharts from 'highcharts';
import { AppUtilities } from '../core/utils/app-utilities';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatLegacyPaginatorModule as MatPaginatorModule,
  MatLegacyPaginator as MatPaginator,
} from '@angular/material/legacy-paginator';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { inOutAnimation } from '../core/shared/fade-in-out-animation';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { HighchartsChartModule } from 'highcharts-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CheckedInviteesTable } from '../core/enums/checked-invitees-table';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  animations: [inOutAnimation],
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    IonicModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    MatStepperModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    HighchartsChartModule,
    TranslateModule,
    MatDialogModule,
  ],
})
export class DashboardPage implements OnInit, AfterViewInit, OnDestroy {
  isScanning: boolean = false;
  showingList: boolean = true;
  CheckedInviteesTable: typeof CheckedInviteesTable = CheckedInviteesTable;
  displayedColumns: string[] = [];
  scanSub: any;
  qrText: string;
  userInfo: any;
  listOfInvitee: any;
  guestIn = 0;
  remains = 0;
  totalGuest = 0;
  totalVisitors$ = new BehaviorSubject<number>(0);
  eventname: string;
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
    series: [],
  };
  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginator') paginator!: MatPaginator;
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
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {
    this.platform.backButton.subscribeWithPriority(0, () => {
      document.getElementsByTagName('body')[0].style.opacity = '1';
      this.scanSub.unsubscribe();
    });
    this.userInfo = Number(localStorage.getItem(this.eventIDs));
    this.registerIcons(iconRegistry, sanitizer);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.translate.get('dashboardPage.checkedInviteesTable').subscribe({
      next: (labels) => {
        this.displayedColumns = labels;
      },
    });
    this.eventname = localStorage.getItem(this.event_name);
    this.verifycardlist();
    this.subscriptions.push(
      this.service.refreshNeeded$.subscribe({
        next: (res) => {
          this.verifycardlist();
        },
        error: (err) => {
          throw err;
        },
      })
    );
    const self = this;
    this.chartCallback = (chart) => {
      self.chart = chart;
    };
    this.subscriptions.push(
      this.filterTerm.valueChanges.subscribe({
        next: (searchText) => {
          this.dataSource.filter = searchText.trim().toLocaleLowerCase();
          if (this.paginator) {
            this.paginator.firstPage();
          }
        },
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
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
    this.translate.get('dashboardPage.topBanner.chart').subscribe({
      next: (chartLabels) => {
        self.chartOptions.title = {
          verticalAlign: 'middle',
          floating: true,
          text: `${this.totalGuest}`,
          style: {
            fontSize: '24px',
          },
        };
        (self.chartOptions.subtitle = {
          verticalAlign: 'middle',
          floating: true,
          text: chartLabels.total,
          y: 36,
          style: {
            fontSize: '16px',
          },
        }),
          (self.chartOptions.series = [
            {
              type: 'pie',
              dataLabels: {
                connectorWidth: 0,
                enabled: false,
              },
              data: [
                {
                  y: this.guestIn,
                  color: '#2dd36f',
                  name: chartLabels.checked,
                },
                {
                  y: this.remains,
                  color: '#eb445a',
                  name: chartLabels.unchecked,
                },
              ],
              innerSize: '80%',
            },
          ]);
      },
    });
    self.updateFromInput = true;
  }
  private verifycardlist() {
    AppUtilities.startLoading(this.loadingCtrl).then((loading) => {
      let inviteeChecked$ = from(this.service.inviteeChecked(this.userInfo));
      let getAllinvitee$ = from(this.service.getAllinvitee(this.userInfo));
      let observables = zip(inviteeChecked$, getAllinvitee$);
      this.subscriptions.push(
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
          error: (err) => {
            throw err;
          },
        })
      );
    });
  }
  private closeScanner() {
    this.toggleBodyStyle(false);
    this.qrScanner.hide();
    this.qrScanner.destroy();
    if (this.scanSub) {
      this.scanSub.unsubscribe();
    }
  }
  private toggleBodyStyle(show: boolean): void {
    let body = document.getElementsByTagName('ion-app')[0] as HTMLIonAppElement;
    this.isScanning = show;
    if (show) {
      body.style.visibility = 'hidden';
      window.document.body.style.backgroundColor = 'transparent';
    } else {
      body.style.visibility = 'visible';
      window.document.body.style.backgroundColor = '#FFFFFF';
    }
  }
  getTableValue(invitee: any, index: number) {
    switch (index) {
      case CheckedInviteesTable.VISITOR_NAME:
        return invitee.visitor_name;
      case CheckedInviteesTable.SCANNED:
        return invitee.scan_status;
      case CheckedInviteesTable.TABLE_NUMBER:
        return invitee.table_number;
      case CheckedInviteesTable.VERIFIED_BY:
        return invitee.scanned_by;
      default:
        return '';
    }
  }
  startScanning() {
    //Optionally request the permission early
    this.qrScanner
      .prepare()
      .then((status) => {
        if (status.denied) {
          this.qrScanner.hide();
        } else if (status.authorized) {
          this.toggleBodyStyle(true);
          this.qrScanner.show();
          this.platform.backButton.subscribeWithPriority(10, () => {
            this.closeScanner();
          });
          this.subscriptions.push(
            (this.scanSub = this.qrScanner.scan().subscribe({
              next: (textFound) => {
                this.closeScanner();
                this.qrText = textFound;
                this.sendResult(this.qrText);
              },
            }))
          );
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
