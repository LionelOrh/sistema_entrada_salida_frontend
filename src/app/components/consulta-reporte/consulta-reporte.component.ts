import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { AppMaterialModule } from '../../app.material.module';

@Component({ 
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
 
  selector: 'app-consulta-reporte',
  templateUrl: './consulta-reporte.component.html',
  styleUrls: ['./consulta-reporte.component.css']
})

export class ConsultaReporteComponent {

 }