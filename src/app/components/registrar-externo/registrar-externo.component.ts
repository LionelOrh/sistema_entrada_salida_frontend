import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],

  selector: 'app-registrar-externo',
  templateUrl: './registrar-externo.component.html',
  styleUrls: ['./registrar-externo.component.css'] 
})
export class RegistrarExternoComponent {

}