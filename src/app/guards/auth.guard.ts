import { AuthService } from './../services/auth.service';
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
    private readonly router: Router,
    private authService: AuthService,

  ) { }
  async canActivate() {
    const isLogedIn = this.authService.SessionIsLogedIn();
    console.log(isLogedIn);
    if (isLogedIn == true) {
      return true;
    }
    else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
