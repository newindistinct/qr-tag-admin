import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db } from 'src/config';
import { isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { UserTableComponent } from './user-table/user-table.component';
export interface User {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  remark: string;
  IsEnabled: boolean;
  IsDeleted: boolean;
  create_date: Date;
}
export interface Selected {
  user_id: string;
  user_name: string;
  user_lastName: string;
  user_phone: string;
  user_remark: string;
  user_is_enabled: boolean;
  user_is_deleted: boolean;
  user_create_date: Date;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgxDatatableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserPage implements OnInit {
  key: any;
  email: any;
  selectedTab = 'user';
  SelectionType = SelectionType;
  constructor(private router: Router, private menu: MenuController) { }
  public title!: string;
  private activatedRoute = inject(ActivatedRoute);
  data: any[] = [];
  timestamp: any;
  isModalOpen = false;
  total = 0;
  user: User = {
    id: '',
    name: '',
    lastName: '',
    phone: '',
    remark: '',
    IsEnabled: true,
    IsDeleted: false,
    create_date: new Date()
  };



  selected: Selected[] = [];
  loadDatatable = false;
  columns = [
    { prop: 'user_id', name: 'ID' },
    { prop: 'user_name', name: 'Name' },
    { prop: 'user_lastName', name: 'Lastname' },
    { prop: 'user_phone', name: 'phone' },
    { prop: 'user_remark', name: 'remark' },
    { prop: 'user_is_enabled', name: 'IsEnabled' },
    { prop: 'user_is_deleted', name: 'IsDeleted' },
    { prop: 'user_create_date', name: 'User_Create_Date' },
  ];
  async ngOnInit(): Promise<void> {
    this.menu.enable(true);
    this.title = this.activatedRoute.snapshot.paramMap.get('id') as string;
    console.log(this.title);
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      this.data.push(doc.data());
      // this.timestamp = doc.data()['user_create_date'];
      // const date = new Date(this.timestamp.seconds * 1000);
      // const options: Intl.DateTimeFormatOptions = {
      //   year: 'numeric',
      //   month: 'long',
      //   day: 'numeric',
      //   hour: 'numeric',
      //   minute: 'numeric',
      //   second: 'numeric',
      //   timeZoneName: 'short'
      // };
      // const formattedDate = date.toLocaleDateString('th-TH', options);
      // console.log(formattedDate);
    });
    this.total = this.data.length;
    this.loadDatatable = true;
    console.log(this.data);
  }
  ngAfterViewInit() {

  }
  addData() {
    console.log('addData');
    // this.isModalOpen = !this.isModalOpen;
  }
  tabUser() {
    // this.loadDatatable = true;
  }
  tabDepartment() {
    // this.loadDatatable = true;
  }
  async addDataToFirebase(form: NgForm) {

    // this.isModalOpen = false;
    console.log(form.value.id);
    console.log(form.value.name);
    console.log(form.value.lastName);
    console.log(form.value.phone);
    console.log(form.value.remark);
    console.log(form.value.IsEnabled);
    console.log(form.value.IsDeleted);
    await addDoc(collection(db, "users"), {
      user_id: this.total + 1,
      user_name: this.user.name,
      user_lastName: this.user.lastName,
      user_phone: this.user.phone,
      user_remark: this.user.remark,
      user_is_enabled: this.user.IsEnabled,
      user_is_deleted: this.user.IsDeleted,
      user_create_date: serverTimestamp()
    });
  }
  onSelect(selected: any) {
    console.log('Select Event', selected, this.selected);
    this.isModalOpen = !this.isModalOpen;
  }
  async updateDataToFirebase(form: NgForm) {
    const q = query(collection(db, "users"), where("user_id", "==", this.selected[0].user_id));
    await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.key = doc.id;
      });
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });
    const userDocRef = doc(db, "users", this.key);
    console.log(userDocRef);
    await updateDoc(userDocRef, {
      user_id: this.selected[0].user_id,
      user_name: this.selected[0].user_name,
      user_lastName: this.selected[0].user_lastName,
      user_phone: this.selected[0].user_phone,
      user_remark: this.selected[0].user_remark,
      user_is_enabled: this.selected[0].user_is_enabled,
      user_is_deleted: this.selected[0].user_is_deleted,
      user_create_date: serverTimestamp()
    });
    this.isModalOpen = !this.isModalOpen;
  };
  onActivate(event: any) {
    console.log('Activate Event', event);
  }
  onAuthStateChanged() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        this.email = user.email;
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
}
