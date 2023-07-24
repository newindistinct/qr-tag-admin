import { db } from './../../../config';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, NgxDatatableModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EquipmentPage implements OnInit {
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
      console.log(doc.id, " => ", doc.data());
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
  // ngOnInit() {
  //   this.menu.enable(true);
  //   this.title = this.activatedRoute.snapshot.paramMap.get('id') as string;
  // }

}
