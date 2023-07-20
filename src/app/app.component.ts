import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { RoutesService } from './services/routes.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class AppComponent {
  public appPages = [
    { title: 'User & Department', url: 'user', icon: 'settings' },
    { title: 'Equipment', url: 'equipment', icon: 'pricetags' },
    { title: 'Location', url: 'location', icon: 'business' },
    // { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor( private menu: MenuController,
    private routes: RoutesService,) {}
  ngOnInit() {
    console.log('AppComponent ngOnInit');
    // this.menu.enable(false);
    // this.menu.enable(true);
  }
  handlePageSelected(page: string) {
    this.routes.routesMenu(page);
  }
}
