import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { AutorService } from '../../services/autor.service';
@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-consulta-autor',
  templateUrl: './consulta-autor.component.html',
  styleUrls: ['./consulta-autor.component.css']
})
export class ConsultaAutorComponent implements OnInit {
  //Grila
  dataSource: any;

  //Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idAutor", "nombres", "apellidos", "fechaNacimiento", "telefono", "celular", "orcid", "pais", "grado", "estado"];

  ltsPais: Pais[] = [];
  ltsGrado: DataCatalogo[] = [];

  //PARA LOS FILTROS
  varNombres: string = "";
  varApellidos: string = "";
  varFechaNacimientoDesde: Date = new Date();
  varFechaNacimientoHasta: Date = new Date();
  varTelefono: string = "";
  varCelular: string = "";
  varOrcid: string = "";
  varIdPais: number = -1;
  varIdGrado: number = -1;
  varEstado: boolean = false;

  constructor(private utilService: UtilService, private serviceAutor: AutorService) { }

  ngOnInit(): void {
    this.utilService.listaPais().subscribe(
      x => this.ltsPais = x
    );
    this.utilService.listaGradoAutor().subscribe(
      x => this.ltsGrado = x
    );
  }

  filtrar() {
    console.log(">>> Filtrar [ini]");
    console.log(">>> varNombres: " + this.varNombres);
    console.log(">>> varApellidos: " + this.varApellidos);
    console.log(">>> varFechaNacimientoDesde: " + this.varFechaNacimientoDesde.toISOString());
    console.log(">>> varFechaNacimientoHasta: " + this.varFechaNacimientoHasta.toISOString());
    console.log(">>> varTelefono: " + this.varTelefono);
    console.log(">>> varCelular: " + this.varCelular);
    console.log(">>> varOrcid: " + this.varOrcid);
    console.log(">>> varEstado: " + this.varEstado);
    console.log(">>> varIdPais: " + this.varIdPais);
    console.log(">>> varIdGrado: " + this.varIdGrado);

    this.serviceAutor.ConsultaAutorComplejo(
      this.varNombres,
      this.varApellidos,
      this.varFechaNacimientoDesde.toISOString(),
      this.varFechaNacimientoHasta.toISOString(),
      this.varTelefono,
      this.varCelular,
      this.varOrcid,
      this.varEstado ? 1 : 0,
      this.varIdPais,
      this.varIdGrado).subscribe(
        x => {
          this.dataSource = x;
          this.dataSource.paginator = this.paginator;
        }
      );
    console.log(">>> Filtrar [fin]");
  }

}
