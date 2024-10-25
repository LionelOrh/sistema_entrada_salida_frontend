import { Component, OnInit, ViewChild } from '@angular/core';
import { Rol } from '../../models/rol.model';
import { UtilService } from '../../services/util.service';
import { AccesoService } from '../../services/acceso.service';
import { MatPaginator } from '@angular/material/paginator';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-consulta-reporte',
  templateUrl: './consulta-reporte.component.html',
  styleUrls: ['./consulta-reporte.component.css']
})

export class ConsultaReporteComponent implements OnInit {
  // Grilla
  dataSource: any;
  // Clase para la paginación
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // Cabecera
  displayedColumns = ["codigo", "nombres", "apellidos", "fecha", "rol", "estado"];

  // Para el combobox
  lstRol: Rol[] = [];

  varCodigo: string = "";
  varFechaDesde: Date = new Date(1900, 0, 1);
  varFechaHasta: Date = new Date();
  varRol: number = -1;

  constructor(private utilService: UtilService, private accesoService: AccesoService) { }

  ngOnInit() {
    this.utilService.listaRol().subscribe(
      x => this.lstRol = x
    );
  }

  // Función para formatear las fechas a 'YYYY-MM-DD'
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Separa solo la parte de la fecha
  }

  filtrar() {
    console.log(">>> Filtrar [ini]");
    console.log(">>> varCodigo: " + this.varCodigo);
    console.log(">>> varFechaDesde: " + this.formatDate(this.varFechaDesde));
    console.log(">>> varFechaHasta: " + this.formatDate(this.varFechaHasta));
    console.log(">>> varRol: " + this.varRol);
  
    this.accesoService.consultaReporteAccesos(
      this.varCodigo,
      this.varFechaDesde.toISOString().split('T')[0],
      this.varFechaHasta.toISOString().split('T')[0],
      this.varRol
    ).subscribe(
      x => {
        console.log("Data recibida: ", x); // Para asegurarte de que recibes datos
        this.dataSource = x; // Asignar el dataSource a la tabla
        this.dataSource.paginator = this.paginator;
      }
    );
    
    
  }

  exportarExcel() {
    console.log(">>> Filtrar [ini]");
    console.log(">>> varCodigo: " + this.varCodigo);
    console.log(">>> varFechaDesde: " + this.formatDate(this.varFechaDesde));
    console.log(">>> varFechaHasta: " + this.formatDate(this.varFechaHasta));
    console.log(">>> varRol: " + this.varRol);
    
    this.accesoService.generateDocumentExcel( 
      this.varCodigo,
      this.varFechaDesde.toISOString().split('T')[0],
      this.varFechaHasta.toISOString().split('T')[0],
      this.varRol).subscribe(
      response => {
        console.log(response);
        var url = window.URL.createObjectURL(response.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.setAttribute('target', 'blank');
        a.href = url;
        a.download = response.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }); 
}

exportarPDF() {

  this.accesoService.generateDocumentReport(
    this.varCodigo,
      this.varFechaDesde.toISOString().split('T')[0],
      this.varFechaHasta.toISOString().split('T')[0],
      this.varRol).subscribe(
      response => {
        console.log(response);
        var url = window.URL.createObjectURL(response.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.setAttribute('target', 'blank');
        a.href = url;
        a.download = response.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
}
}
