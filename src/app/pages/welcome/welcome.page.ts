import { isSignInWithEmailLink, onAuthStateChanged, signInWithEmailLink, signOut } from 'firebase/auth';
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
  ngOnInit() {
    this.menu.enable(false);
    this.hospital = [
      {site_id:'HPT01', site_name: 'โรงพยาบาลสมเด็จพระยุพราชนนทบุรี' },
      {site_id:'HPT02', site_name: 'โรงพยาบาลสมเด็จพระพุทธเลิศหล้า' },
      {site_id:'HPT03', site_name: 'โรงพยาบาลนครนนท์' },
      {site_id:'HPT04', site_name: 'โรงพยาบาลราชเทวี' },
      {site_id:'HPT05', site_name: 'โรงพยาบาลกรุงเทพคริสเตียน' },
    ];
    console.log(window.location.href);
    if (isSignInWithEmailLink(auth, window.location.href)) {

      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn');
      console.log(email);
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email!, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.log(error);
        });
    }
  }
  onAuthStateChanged() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(user);
        // ...
      } else {
        console.log('no user');
        // User is signed out
        // ...
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
