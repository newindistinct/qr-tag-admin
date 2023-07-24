import { CommonModule, NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, IonicModule } from '@ionic/angular';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from 'src/config';
import { OverlayEventDetail } from '@ionic/core/components';
// import { ColumnMode } from '@swimlane/ngx-datatable/public-api';
// import { ColumnMode } from 'projects/swimlane/ngx-datatable/src/public-api';
// import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, NgxDatatableModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class UserTableComponent implements OnInit {
  @ViewChild(IonModal) modal?: IonModal;
  data: any[] = [];
  timestamp: any;
  isModalOpen = false;
  name: string = '';
  lastName: string = '';
  phone: string = '';
  @ViewChild(DatatableComponent) table?: DatatableComponent;
  loadDatatable = false;
  async ngOnInit(): Promise<void> {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      // // this.data2=doc.data();
      this.timestamp = doc.data()['user_create_date'];
      this.data.push(doc.data());
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

      console.log(formattedDate);

    });

    this.loadDatatable = true;
    console.log(this.data);
  }

  // data = [
  //   { name: 'John Doe', age: 30, city: 'New York' },
  //   { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  //   // Add more data as needed
  // ];

  columns = [
    { prop: 'user_id', name: 'ID' },
    { prop: 'user_name', name: 'Name' },
    { prop: 'user_lastName', name: 'Lastname' },
    { prop: 'user_phone', name: 'phone' },
    { prop: 'user_create_date', name: 'User_Create_Date' },
  ];
  ColumnMode = ColumnMode;

  constructor() {
  }
  updateFilter(event: any) {
    // const val = event.target.value.toLowerCase();

    // // filter our data
    // const temp = this.temp.filter(function (d) {
    //   return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    // });

    // // update the rows
    // this.data = temp;
    // // Whenever the filter changes, always go back to the first page
    // this.loadDatatable = false;
    // this.loadDatatable = true;
  }
  addData() {
    console.log('addData');
    this.isModalOpen = true;
  }
  // onWillDismiss(event: Event) {
  //   const ev = event as CustomEvent<OverlayEventDetail<string>>;
  //   if (ev.detail.role === 'confirm') {
  //     // this.message = `Hello, ${ev.detail.data}!`;
  //   }
  // }
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
