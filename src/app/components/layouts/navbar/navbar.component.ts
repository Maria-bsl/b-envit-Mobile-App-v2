import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [MatMenuModule, IonicModule],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {}
  changepass() {
    this.router.navigate(['changepwd']);
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
