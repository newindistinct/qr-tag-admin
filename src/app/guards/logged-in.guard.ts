import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard {
  constructor(
    private readonly router: Router,
    private authService: AuthService,

  ) { }
  canActivate() {
    const isLogedIn = this.authService.SessionIsLogedIn();
    console.log(isLogedIn);
    if (!isLogedIn == true) {
      this.authService.signInAnonymously();
      return true;
    }
    else {
      this.router.navigateByUrl('');
      return false;
    }

  }
}

