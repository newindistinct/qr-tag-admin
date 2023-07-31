import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { onAuthStateChanged, sendSignInLinkToEmail, signInAnonymously } from 'firebase/auth';
import { auth, db } from 'src/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  failMassage: string = '';
  errorMassage: string = '';
  site: any[] = [];
  isModalOpen = false;

  constructor(
    private menu: MenuController,
    private router: Router,
    private authService: AuthService,) { }

  async ngOnInit() {
    this.menu.enable(false);
    // const isLogedIn = await this.authService.SessionLogedInIs();
    // if (isLogedIn == true) {
    //   console.log('isLogedIn');
      // this.router.navigateByUrl('');
    // } else {
    //   this.authService.signInAnonymously();
    // }
  }
  async checkAdmin(form: NgForm) {
    await this.authService.checkAdmin(form.value.email);
  }
}
