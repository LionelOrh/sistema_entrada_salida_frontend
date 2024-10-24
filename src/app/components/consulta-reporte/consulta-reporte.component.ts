import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { AppMaterialModule } from '../../app.material.module';
import { Rol } from '../../models/rol.model';
import { Acceso } from '../../models/acceso.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { AccesoService } from '../../services/acceso.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],

  selector: 'app-consulta-reporte',
  templateUrl: './consulta-reporte.component.html',
  styleUrls: ['./consulta-reporte.component.css']
})

export class ConsultaReporteComponent implements OnInit {
  //grilla
  dataSource: any;
  //Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["codigo", "nombres", "apellidos", "fecha", "rol", "estado"];

  //Para el combobox
  lstRol: Rol[] = [];

  varCodigo: number = 0;
  varRol: number = -1;
  varFecha: Date = new Date();
  varEstado: boolean = false;

  constructor(private utilService: UtilService, private accesoService: AccesoService) { }

  ngOnInit() {
    this.utilService.listaRol().subscribe(
      x => this.lstRol = x
    );
  }

  filtrar() {
    this.accesoService.ConsultaReporte(
      this.varCodigo,
      this.varFecha,
      this.varEstado ? 1 : 0,
      this.varRol).subscribe(
        x => {
          this.dataSource = x;
          this.dataSource.paginator = this.paginator;
        }
      );
    
  }

}