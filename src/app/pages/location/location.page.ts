import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from 'src/config';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, NgxDatatableModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LocationPage implements OnInit {
  public title!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor(private menu: MenuController) { }
  data: any[] = [];
  timestamp: any;
  isModalOpen = false;
  name: string = '';
  lastName: string = '';
  phone: string = '';
  loadDatatable = false;
  columns = [
    { prop: 'user_id', name: 'ID' },
    { prop: 'user_name', name: 'Name' },
    { prop: 'user_lastName', name: 'Lastname' },
    { prop: 'user_phone', name: 'phone' },
    { prop: 'user_create_date', name: 'User_Create_Date' },
  ];
  async ngOnInit(): Promise<void> {
    this.menu.enable(true);
    this.title = this.activatedRoute.snapshot.paramMap.get('id') as string;
    console.log(this.title);
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      this.data.push(doc.data());
      console.log(doc.id, " => ", doc.data());
      this.timestamp = doc.data()['user_create_date'];
      const date = new Date(this.timestamp.seconds * 1000);
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
      const datetime = formattedDate.split(' ');
      console.log(formattedDate);
      console.log(datetime);

    });

    this.loadDatatable = true;
    console.log(this.data);
  }
  addData() {
    console.log('addData');
    this.isModalOpen = true;
  }
  async addDataToFirebase(form: NgForm) {

    // this.isModalOpen = false;
    console.log(form.value.name);
    console.log(form.value.lastName);
    console.log(form.value.phone);
    await addDoc(collection(db, "users"), {
      "user_name": form.value.name,
      "user_lastName": form.value.lastName,
      "user_phone": form.value.phone,
      "user_create_date": serverTimestamp()
    });
  }

}
