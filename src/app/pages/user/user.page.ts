import { AuthService } from './../../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { addDoc, collection, doc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db } from 'src/config';
import { isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { auditTime, debounceTime } from 'rxjs';
export interface User {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  remark: string;
  site: string;
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
  filteredUser: any[] = [];
  // email: any;
  selectedTab = 'user';
  SelectionType = SelectionType;
  constructor(private router: Router, private menu: MenuController, private authService: AuthService) { }
  public title: string;
  private activatedRoute = inject(ActivatedRoute);
  data: any[] = [];
  // timestamp: any;
  isModalOpen = false;
  total = 0;
  user: User = {
    id: '',
    name: '',
    lastName: '',
    phone: '',
    remark: '',
    site: '',
    IsEnabled: true,
    IsDeleted: false,
    create_date: new Date()
  };


  unsubscribe: any;
  selected: Selected[] = [];
  loadDatatable = false;
  columns = [
    { prop: 'user_id', name: 'ID' },
    { prop: 'user_name', name: 'Name' },
    { prop: 'user_lastName', name: 'Lastname' },
    { prop: 'user_phone', name: 'phone' },
    { prop: 'user_remark', name: 'remark' },
    { prop: 'user_site', name: 'site' },
    { prop: 'user_is_enabled', name: 'IsEnabled' },
    { prop: 'user_is_deleted', name: 'IsDeleted' },
    { prop: 'user_create_date', name: 'User_Create_Date' },
    { prop: 'user_update_date', name: 'user_Update_date' },
  ];
  onInput = new EventEmitter<string>();
  // // @Output() onSearch = this.onInput.pipe(debounceTime(400));
  // @Output() onSearch = this.onInput.pipe(auditTime(400));
  inputSearch(text: string) {
    console.log('inputSearch :', text);
    this.onInput.pipe(debounceTime(400));
    this.onInput.emit(text);
    this.filteredUser = this.data.filter((data) => {
      const Name = data.user_name.toLowerCase();
      const searchName = text.toLowerCase();
      return Name.indexOf(searchName) !== -1;
    });
    console.log(this.filteredUser);
  }
  async ngOnInit(): Promise<void> {
    this.menu.enable(true);
    this.title = this.activatedRoute.snapshot.paramMap.get('id') as string;
    console.log(this.title);
    console.log(this.authService.dataAdmin);
    this.fetchData();
  }
  async fetchData() {
    const userDocRef = collection(db, "users");
    this.unsubscribe = await onSnapshot(userDocRef, (querySnapshot) => {
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        // data.push(doc.data());
        data.push({
          key: doc.id,
          user_id: doc.data()['user_id'],
          user_name: doc.data()['user_name'],
          user_lastName: doc.data()['user_lastName'],
          user_phone: doc.data()['user_phone'],
          user_remark: doc.data()['user_remark'],
          user_site: doc.data()['user_site'],
          user_is_enabled: doc.data()['user_is_enabled'],
          user_is_deleted: doc.data()['user_is_deleted'],
          user_create_date: this.changeDatetime(doc.data()['user_create_date']),
          user_update_date: this.changeDatetime(doc.data()['user_update_date'])
        });
      });
      console.log(data);
      // console.log(this.authService.site);
      if (this.authService._site_id == 'All-Site') {
        this.data = data
        // .filter((item) => item.user_site == this.authService.dataAdmin);
        this.filteredUser = this.data;
      } else {
        this.data = data.filter((item) => item.user_site == this.authService._site_id);
        this.filteredUser = this.data;
      }
      this.total = this.data.length;
      this.loadDatatable = true;
      console.log(this.data);
    }, (error) => {
      console.log("Error getting documents: ", error);
    });
  }
  changeDatetime(timestamp: any) {
    const date = new Date(timestamp.seconds * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };
    const formattedDate = date.toLocaleDateString('th-TH', options);
    // const datetime = formattedDate.split(' ');
    // console.log(formattedDate);
    // console.log(datetime);
    return formattedDate;
  }
  // searchUser(event: any) {
  //   // searchUser(ev: any) {
  // this.filteredUser = this.data.filter((data) => {
  //   const productName = data.user_name.toLowerCase();
  //   const searchName = ev.target.value.toLowerCase();
  //   return productName.indexOf(searchName) !== -1;
  // });
  //   //   console.log(this.filteredUser);
  //   // }
  //   const val = event.target.value;
  //   console.log(val);
  //   if (val && val.trim() !== '') {
  //     this.data = this.data.filter((item) => {
  //       return (item.user_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     });
  //     console.log(this.data);
  //   } else {
  //     // this.fetchData();
  //   }
  // }
  ngAfterViewInit() {

  }
  ngOnDestroy() {
    // Unsubscribe from the real-time listener to avoid memory leaks
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  // addData() {
  //   console.log('addData');
  //   // this.isModalOpen = !this.isModalOpen;
  // }
  async addDataToFirebase(form: NgForm) {
    await addDoc(collection(db, "users"), {
      user_id: `U100${this.total + 1}`,
      user_name: this.user.name,
      user_lastName: this.user.lastName,
      user_phone: this.user.phone,
      user_remark: this.user.remark,
      user_site: this.user.site,
      user_is_enabled: this.user.IsEnabled,
      user_is_deleted: this.user.IsDeleted,
      user_create_date: serverTimestamp(),
      user_update_date: serverTimestamp()
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
      user_update_date: serverTimestamp()
    });
    this.isModalOpen = !this.isModalOpen;
  };
  async deleteDataFromFirebase(form: NgForm) {
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
      user_is_deleted: true,
      user_update_date: serverTimestamp()
    });
    this.isModalOpen = !this.isModalOpen;
  }
  onActivate(event: any) {
    console.log('Activate Event', event);
  }

}
