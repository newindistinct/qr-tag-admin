import { isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInAnonymously, signInWithEmailLink, signOut } from 'firebase/auth';
import { Injectable } from '@angular/core';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from 'src/config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogedIn: boolean;
  emailAdmin: string
  dataAdmin: any[] = [];
  _site_id = 'All-Site';
  constructor(private router: Router) { }
  
  async checkAdmin(email: any) {
    console.log('checkAdmin');
    const q = query(collection(db, "site"), where("site_admin", "==", email));
    const site = await new Promise<any>((resolve) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        unsubscribe();
        resolve(querySnapshot);
      });
    });
    if (site.empty) {
      console.log('ไม่มีข้อมูลผู้ดูแลระบบ');
      return;
    }
    const data: any[] = [];
    site.forEach((doc: any) => {
      // console.log(doc.id, " => ", doc.data());
      data.push(doc.data());
    });
    this.dataAdmin = data;
    // console.log(this.dataAdmin);
    if (this.isLogedIn == true) {
      console.log('isLogedIn');
    }
    else {
      console.log('notLogedIn');
      this.sendSignInLinkToEmail(email)
    }
    // });
  }
  async sendSignInLinkToEmail(email: string) {
    const actionCodeSettings = {
      url: 'http://localhost:8100',
      handleCodeInApp: true,
    };
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        console.log("ส่งลิงค์ไปที่อีเมล์แล้ว");
        localStorage.setItem('emailForSignIn', email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  async receivedSignInLink() {
    const signinSuccess = await new Promise<boolean>((resolve) => {
      console.log(this.isLogedIn);
      if (this.isLogedIn === true) {
        console.log("คุณเคยเข้าสู่ระบบแล้ว");
        resolve(true);
      } else {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem('emailForSignIn');
          console.log(email);
          if (!email) {
            email = window.prompt('Please provide your email for confirmation');
          }
          console.log(email);
          signInWithEmailLink(auth, email!, window.location.href)
            .then(() => {
              window.localStorage.removeItem('emailForSignIn');
              console.log('Sign-in successful.');
              resolve(false);
            })
            .catch((error) => {
              console.error('Error while signing in:', error);

              this.isLogedIn = false;
              resolve(false); // หรืออาจเลือกการ reject(error) เพื่อเปิดโอกาสให้จัดการข้อผิดพลาดเพิ่มเติม
            });
        }
      }
    });
    return signinSuccess;
  }
  async CheckAuth() {
    const user = await new Promise<any>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
    console.log(user);
    if (user) {
      if (user.isAnonymous == false) {
        this.isLogedIn = true;
        this.emailAdmin = user.email;
        localStorage.setItem('token', user.accessToken);
        await this.checkAdmin(this.emailAdmin);
      } else {
        this.isLogedIn = false;
      }
    } else {
      this.receivedSignInLink()
    }
    // this.setRouteSiteID(this._site_id);
  }



  
  async signout() {
    await signOut(auth).then(() => {
      localStorage.removeItem('token');
      this.isLogedIn = false;
      console.log('Sign-out successful.');
      this.router.navigateByUrl('/login');
    }).catch((error) => {
      console.log(error);
    });
  }

  signInAnonymously() {
    signInAnonymously(auth).then(() => {
      console.log('Sign-in Anonymous.');
    }).catch((error) => {
      console.log(error.code, error.message);
    });
  }
  getSite() {
    return this.dataAdmin;
  }
  SessionIsLogedIn() {
    const isLogedIn = localStorage.getItem('token');
    if (isLogedIn) {
      this.isLogedIn == true;
      console.log('isLogedIn');
      return true;
    } else {
      this.isLogedIn == false;
      console.log('isNotLogIn');
      return false;
    }
  }






  setRouteSiteID(site_id: string) {
    this._site_id = site_id;
    this.router.navigateByUrl('site/' + site_id);
  }
  routesMenu(menu: string) {
    console.log('site/' + this._site_id + '/' + menu);
    this.router.navigateByUrl('site/' + this._site_id + '/' + menu);
  }
  // setRouteSiteID(site_id: string) {
  //   this._site_id = site_id;
  //   this.router.navigateByUrl('site/' + site_id);
  // }
  // async checkAuth() {
  //   await onAuthStateChanged(auth, (user: any) => {
  //     console.log(user);
  //     if (user) {
  //       if (user.isAnonymous == false) {
  //         localStorage.setItem('token', user.accessToken);
  //         this.isLogedIn == true;
  //         return true;
  //       } else {
  //         this.isLogedIn == false;
  //         return false;
  //       }
  //     } else {
  //       this.isLogedIn == false;
  //       return false;
  //     }

  //   });

  // }
}
