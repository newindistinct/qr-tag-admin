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

  constructor(private menu: MenuController, private router: Router) { }

  async ngOnInit() {
    this.menu.enable(false);
    onAuthStateChanged(auth, (user) => {
      if (user?.isAnonymous == false) {
        const uid = user.uid;
        console.log(user.isAnonymous);
        this.router.navigateByUrl('');
      } else {
        signInAnonymously(auth).then(() => {
          console.log('Sign-in Anonymous.');
          }).catch((error) => {
            // this.router.navigateByUrl('');
          console.log(error.code, error.message);
        });
      }
    });

  }
  async checkAdmin(form: NgForm) {
    console.log('checkAdmin');
    const q = query(collection(db, "site"), where("site_admin", "==", form.value.email));
    await getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        this.failMassage = 'ไม่พบข้อมูลผู้ดูแลระบบ';
        return;
      }
      this.isModalOpen = true;
      this.failMassage = '';
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        this.site.push(doc.data());
        console.log(this.site);
      });
      this.sendSignInLinkToEmail(form.value.email);
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }

  async sendSignInLinkToEmail(email: string) {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      // url: 'https://meowsurvey-74418.web.app',
      // url: 'https://testdb-36ded.web.app/welcome',
      url: 'http://localhost:8100',
      // This must be true.
      handleCodeInApp: true,
    };
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then((yes) => {
        console.log(yes);
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        localStorage.setItem('emailForSignIn', email);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.errorMassage = errorCode + errorMessage;
        console.log(errorCode, errorMessage);
        // ...
      });
  }

}
