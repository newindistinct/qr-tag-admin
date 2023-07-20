import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private readonly router: Router
  ) { }
  async canActivate() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(user);
      } else {
        console.log('ยังไม่ได้ล็อกอิน');
        this.router.navigateByUrl('');
      }
    });
  }

}
