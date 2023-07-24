import { isSignInWithEmailLink, onAuthStateChanged, signInAnonymously, signInWithEmailLink, signOut } from 'firebase/auth';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { auth } from 'src/config';
import { Router } from '@angular/router';
import { RoutesService } from 'src/app/services/routes.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WelcomePage implements OnInit {
  hospital: any[] = [];
  // constructor() { }
  constructor(
    private router: Router,
    private menu: MenuController,
    private routes: RoutesService) { }
  async ngOnInit() {
    this.menu.enable(false);
    this.hospital = await this.routes.getHotpital();  
    console.log(this.hospital);
    console.log(window.location.href);
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      console.log(email);
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      console.log(email);
      signInWithEmailLink(auth, email!, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  onAuthStateChanged() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(user);
      } else {
        console.log('no user');
      }
    });
  }
  async signout() {
    await signOut(auth).then(() => {
      console.log('Sign-out successful.');
      this.router.navigateByUrl('');
    }).catch((error) => {
      console.log(error);
    });
  }
  selectSite(site_id: string) {
    this.routes.setRouteSiteID(site_id);
  }
}
