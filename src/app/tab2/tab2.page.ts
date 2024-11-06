import {
  AfterViewInit,
  Component,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {
  AnimationController,
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ServiceService } from '../services/service.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { inOutAnimation } from '../core/shared/fade-in-out-animation';
import { AppUtilities } from '../core/utils/app-utilities';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {
  MatLegacyPaginatorModule as MatPaginatorModule,
  MatLegacyPaginator as MatPaginator,
} from '@angular/material/legacy-paginator';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NavbarComponent } from '../components/layouts/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { InviteesTable } from '../core/enums/invitees-table';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  animations: [inOutAnimation],
  standalone: true,
  imports: [
    NavbarComponent,
    IonicModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    Ng2SearchPipeModule,
    TranslateModule,
  ],
})
export class Tab2Page implements OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription[] = [];
  showingList: boolean = true;
  userInfo: any;
  listOfInvitee: any;
  guestIn: any;
  eventname: string;
  InviteesTable: typeof InviteesTable = InviteesTable;

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
  @ViewChildren('templateList', { read: ElementRef })
  templateListRef: QueryList<ElementRef>;
  constructor(
    private service: ServiceService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private animationCtrl: AnimationController,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}
  private registerIcons(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'qr-code-scan',
      sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/boostrap-icons/qr-code-scan.svg'
      )
    );
  }
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
    this.subscriptions.push(
      this.searchInput.valueChanges.subscribe({
        next: (searchText) => {
          this.dataSource.filter = searchText.trim().toLocaleLowerCase();
          if (this.paginator) {
            this.paginator.firstPage();
          }
        },
      })
    );
  }
  ngOnInit() {
    this.registerIcons(this.iconRegistry, this.sanitizer);
    this.requestInviteesList();
    this.searchInputChanged();
    this.paginator.selectConfig;
  }
  ngAfterViewInit(): void {
    this.initListAnimation();
  }
  initListAnimation() {
    const itemRefArray = this.templateListRef.toArray();
    for (let i = 0; i < itemRefArray.length; i++) {
      const element = itemRefArray[i].nativeElement;

      this.animationCtrl
        .create()
        .addElement(element)
        .duration(1000)
        .delay(i * (1000 / 3))
        .easing('cubic-bezier(0.4, 0.0, 0.2, 1.0)')
        .fromTo('transform', 'translateY(50px)', 'translateY(0px)')
        .fromTo('opacity', '0', '1')
        .play();
    }
  }
  requestInviteesList() {
    this.eventname = localStorage.getItem(this.event_name);
    this.event_id = localStorage.getItem(this.eventIDs);
    const body = { event_id: this.event_id };
    AppUtilities.startLoading(this.loadingCtrl).then((loading) => {
      this.subscriptions.push(
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
          })
      );
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  scanVisitor(invitee: any) {
    let swal = AppUtilities.confirmAction(
      `Are you sure you want to scan ${invitee.visitor_name} to event.`
    );
    swal.then((result) => {
      if (result.isConfirmed) {
        this.sendQr(invitee.qr_code);
      }
    });
  }
  sendQr(qrcode: any) {
    const body = { qr_code: qrcode, event_id: this.event_id };
    AppUtilities.startLoading(this.loadingCtrl)
      .then((loading) => {
        this.subscriptions.push(
          this.service
            .sendQr(body)
            .pipe(finalize(() => loading.dismiss()))
            .subscribe({
              next: (res) => {
                this.result = res;
                this.qrResponse = this.result;
                if (this.result.message) {
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
              error: (error) => {
                this.errMsg = error;
                this.resp = this.errMsg.error;
                this.msg = this.resp.message;
                AppUtilities.showErrorMessage('', this.msg);
              },
            })
        );
      })
      .catch((err) => {
        throw err;
      });
  }
  getTableValue(invitee: any, index: number) {
    switch (index) {
      case InviteesTable.VISITOR_NAME:
        return invitee.visitor_name;
      case InviteesTable.MOBILE:
        return invitee.mobile_no;
      case InviteesTable.SIZE:
        return invitee.no_of_persons;
      case InviteesTable.TABLE:
        return invitee.table_number;
      default:
        return '';
    }
  }
  doRefresh(event) {
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
