import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { RoutesService } from './services/routes.service';
import { signInAnonymously } from 'firebase/auth';
import { auth } from 'src/config';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class AppComponent implements OnInit{

  public appPages = [
    { title: 'User & Department', url: 'user', icon: 'settings' },
    { title: 'Equipment', url: 'equipment', icon: 'pricetags' },
    { title: 'Location', url: 'location', icon: 'business' },
  ];
  hospital: any[] = [];
  _site_id = '';
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private menu: MenuController,
    private routes: RoutesService,
    private router: Router) { }
  async ngOnInit() {
    console.log('AppComponent ngOnInit');
    this.hospital = await this.routes.getHotpital();  
    this._site_id = await this.routes.getPresentHotpital();
    console.log(this.hospital);
  }
  handlePageSelected(page: string) {
    this.routes.routesMenu(page);
  }
}
