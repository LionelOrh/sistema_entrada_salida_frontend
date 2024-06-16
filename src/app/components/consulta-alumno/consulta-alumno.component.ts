import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { AlumnoService } from '../../services/alumno.service';
@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],


  selector: 'app-consulta-alumno',
  templateUrl: './consulta-alumno.component.html',
  styleUrls: ['./consulta-alumno.component.css']
})
export class ConsultaAlumnoComponent implements OnInit {
  //Grila
  dataSource: any;

  //Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idAlumno", "nombres", "apellidos", "telefono", "celular", "dni", "correo", "tipoSangre", "fechaNacimiento", "pais", "modalidad", "estado"];

  ltsPais: Pais[] = [];
  ltsModalidad: DataCatalogo[] = [];

  //PARA LOS FILTROS
  varNombres: string = "";
  varApellidos: string = "";
  varTelefono: string = "";
  varCelular: string = "";
  varDni: string = "";
  varCorreo: string = "";
  varTipoSangre: string = "";
  varFechaNacimientoDesde: Date = new Date();
  varFechaNacimientoHasta: Date = new Date();

  varIdPais: number = -1;
  varIdModalidad: number = -1;
  varEstado: boolean = false;

  constructor(private utilService: UtilService, private serviceAlumno: AlumnoService) { }

  ngOnInit(): void {
    this.utilService.listaPais().subscribe(
      x => this.ltsPais = x
    );
    this.utilService.listaModalidadAlumno().subscribe(
      x => this.ltsModalidad = x
    );

  }
  filtrar() {
    console.log(">>> Filtrar [ini]");
    console.log(">>> varNombres: " + this.varNombres);
    console.log(">>> varApellidos: " + this.varApellidos);
    console.log(">>> varTelefono: " + this.varTelefono);
    console.log(">>> varCelular: " + this.varCelular);
    console.log(">>> varDni: " + this.varDni);
    console.log(">>> varCorreo: " + this.varCorreo);
    console.log(">>> varTipoSangre: " + this.varTipoSangre);
    console.log(">>> varFechaNacimientoDesde: " + this.varFechaNacimientoDesde.toISOString);
    console.log(">>> varFechaNacimientoHasta: " + this.varFechaNacimientoHasta.toISOString);
    console.log(">>> varEstado: " + this.varEstado);
    console.log(">>> varIdPais: " + this.varIdPais);
    console.log(">>> varIdModalidad: " + this.varIdModalidad);

    this.serviceAlumno.ConsultaAlumnoComplejo(
      this.varNombres,
      this.varApellidos,
      this.varTelefono,
      this.varCelular,
      this.varDni,
      this.varCorreo,
      this.varTipoSangre,
      this.varFechaNacimientoDesde.toISOString(),
      this.varFechaNacimientoHasta.toISOString(),
      this.varEstado ? 1 : 0,
      this.varIdPais,
      this.varIdModalidad).subscribe(
        x => {
          this.dataSource = x;
          this.dataSource.paginator = this.paginator;
        }
      );
    console.log(">>> Filtrar [fin]");
  }

  exportarPDF() {

    this.serviceAlumno.generateDocumentExcel(
      this.varNombres,
      this.varApellidos,
      this.varTelefono,
      this.varCelular,
      this.varDni,
      this.varCorreo,
      this.varTipoSangre,
      this.varFechaNacimientoDesde.toISOString(),
      this.varFechaNacimientoHasta.toISOString(),
      this.varEstado ? 1 : 0,
      this.varIdPais,
      this.varIdModalidad).subscribe(
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

  exportarExcel() {
    console.log(">>> Filtrar [ini]");
    console.log(">>> varNombres: " + this.varNombres);
    console.log(">>> varApellidos: " + this.varApellidos);
    console.log(">>> varTelefono: " + this.varTelefono);
    console.log(">>> varCelular: " + this.varCelular);
    console.log(">>> varDni: " + this.varDni);
    console.log(">>> varCorreo: " + this.varCorreo);
    console.log(">>> varTipoSangre: " + this.varTipoSangre);
    console.log(">>> varFechaNacimientoDesde: " + this.varFechaNacimientoDesde.toISOString);
    console.log(">>> varFechaNacimientoHasta: " + this.varFechaNacimientoHasta.toISOString);
    console.log(">>> varEstado: " + this.varEstado);
    console.log(">>> varIdPais: " + this.varIdPais);
    console.log(">>> varIdModalidad: " + this.varIdModalidad);
    
this.serviceAlumno.generateDocumentExcel( 
  this.varNombres,
  this.varApellidos,
  this.varTelefono,
  this.varCelular,
  this.varDni,
  this.varCorreo,
  this.varTipoSangre,
  this.varFechaNacimientoDesde.toISOString(),
  this.varFechaNacimientoHasta.toISOString(),
  this.varEstado ? 1 : 0,
  this.varIdPais,
  this.varIdModalidad).subscribe(
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
