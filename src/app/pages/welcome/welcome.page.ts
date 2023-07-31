import { AuthService } from './../../services/auth.service';
import { isSignInWithEmailLink, onAuthStateChanged, signInAnonymously, signInWithEmailLink, signOut } from 'firebase/auth';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { auth } from 'src/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WelcomePage implements OnInit {
  // hospital: any[] = [];
  // // constructor() { }
  constructor(
    private router: Router,
    private menu: MenuController,
    private authService:AuthService) { }
  async ngOnInit() {
    // this.routes.setRouteSiteID(this.routes._site_id);
  }
  //   // this.menu.enable(false);
  //   // this.authService.receivedSignInLink();
  //   // this.hospital = await this.routes.getHotpital();  
  //   console.log(this.hospital);
  //   console.log(window.location.href);
    
  // }
  // onAuthStateChanged() {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log(user);
  //     } else {
  //       console.log('no user');
  //     }
  //   });
  // }
  // async signout() {
  //   this.authService.signout();
  // }
  // selectSite(site_id: string) {
  //   this.routes.setRouteSiteID(site_id);
  // }
}
