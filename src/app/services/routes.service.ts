import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  _site_id = '';
  constructor(private router: Router) { }
  setRouteSiteID(site_id: string) {
    this._site_id = site_id;
    this.router.navigateByUrl('site/' + site_id);
  }
  routesMenu(menu: string) {
    console.log('site/' + this._site_id + '/' + menu);
    this.router.navigateByUrl('site/' + this._site_id + '/' + menu);
  }
}
