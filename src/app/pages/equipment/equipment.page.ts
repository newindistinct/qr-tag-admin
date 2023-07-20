import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EquipmentPage implements OnInit {
  public title!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor(private menu: MenuController) { }

  ngOnInit() {
    this.menu.enable(true);
    this.title = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

}
