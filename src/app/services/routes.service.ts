import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  public hospital = [
    {site_id:'HPT01', site_name: 'โรงพยาบาลสมเด็จพระยุพราชนนทบุรี' },
    {site_id:'HPT02', site_name: 'โรงพยาบาลสมเด็จพระพุทธเลิศหล้า' },
    {site_id:'HPT03', site_name: 'โรงพยาบาลนครนนท์' },
    {site_id:'HPT04', site_name: 'โรงพยาบาลราชเทวี' },
    {site_id:'HPT05', site_name: 'โรงพยาบาลกรุงเทพคริสเตียน' },
  ];
  _site_id = '';
  _site_name = '';
  constructor(private router: Router) { }
  getHotpital(){
    return this.hospital;
  }
  getPresentHotpital(){
    return this._site_id;
  }
  setRouteSiteID(site_id: string) {
    this._site_id = site_id;
    this.router.navigateByUrl('site/' + site_id);
  }
  routesMenu(menu: string) {
    console.log('site/' + this._site_id + '/' + menu);
    this.router.navigateByUrl('site/' + this._site_id + '/' + menu);
  }
}
