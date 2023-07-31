import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { signInAnonymously } from 'firebase/auth';
import { auth } from 'src/config';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class AppComponent implements OnInit {
  siteId = this.authService._site_id;
  emailAdmin: string;
  site: any;
  constructor(
    private menu: MenuController,
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    console.log('ngOnInit');
    // this.authService.SessionIsLogedIn();
    await this.authService.CheckAuth();
    await this.authService.receivedSignInLink().then(async (res) => {
      console.log(res);
      if (res === true) {
        // console.log(this.authService.isLogedIn);
        this.site = this.authService.dataAdmin;
        console.log(this.site);
      } else {
        await this.authService.CheckAuth();
      }
    }).then(() => {
      console.log('setRouteSiteID');
      this.site = this.authService.dataAdmin;
      console.log(this.site);
      this.authService.setRouteSiteID(this.authService._site_id);
    });

    // try {
    //   // await this.authService.SessionIsLogedIn();
    //   await this.authService.receivedSignInLink();
    //   await this.authService.CheckAuth();
    //   this.test();
    // console.log(site);
    //   this.routes.setRouteSiteID(this.routes.siteId);
    // } catch (error) {
    //   console.log(error);
    // }
  }
  async test() {
    // console.log('test');
    //  this.site = this.authService.dataAdmin;
    //  this.emailAdmin = this.authService.emailAdmin;
    // //  this.routes.setRouteSiteID(this.siteId);
    // console.log(this.site);
  }


  public appPages = [
    { title: 'User & Department', url: 'user', icon: 'settings' },
    { title: 'Equipment', url: 'equipment', icon: 'pricetags' },
    { title: 'Location', url: 'location', icon: 'business' },
  ];

  selectSite(ev: any) {
    console.log(ev.detail.value);
    this.authService.setRouteSiteID(ev.detail.value);
  }
  handlePageSelected(page: string) {
    this.authService.routesMenu(page);
  }
  async signout() {
    this.authService.signout();
  }
}
