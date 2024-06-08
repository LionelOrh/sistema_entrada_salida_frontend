import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { MatPaginator } from '@angular/material/paginator';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { TesisService } from '../../services/tesis.service';
@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-consulta-tesis',
  templateUrl: './consulta-tesis.component.html',
  styleUrls: ['./consulta-tesis.component.css']
})
export class ConsultaTesisComponent implements OnInit {
      //Grila
      dataSource:any;

      //Clase para la paginacion
      @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

      //Cabecera
      displayedColumns = ["idTesis","titulo","fechaCreacion","tema","idioma","centroEstudios", "estado"];

      //PARA LOS COMBOBOX
      lstTema: DataCatalogo[] = [];
      lstIdioma: DataCatalogo[] = [];
      lstCentroEstudios: DataCatalogo[] = [];

      //PARA LOS FILTROS
      varTitulo: string = "";
      varEstado: boolean = false;
      varFechaCreacionDesde: Date = new Date();
      varFechaCreacionHasta: Date = new Date();
      varIdTema: number = -1;
      varIdIdioma: number = -1;
      varIdCentroEstudios: number = -1;

  constructor(private utilService:UtilService, private tesisService : TesisService) { }

  ngOnInit() {
    this.utilService.listaTemaTesis().subscribe(
           x =>  this.lstTema = x
     );
     this.utilService.listaIdioma().subscribe(
       x =>  this.lstIdioma = x
     ); 
     this.utilService.listaCentroEstudios().subscribe(
      x =>  this.lstCentroEstudios = x
    ); 
  }

  filtrar(){
    console.log(">>> Filtrar [ini]");
    console.log(">>> varTitulo: "+this.varTitulo);
    console.log(">>> varEstado: "+this.varEstado);
    console.log(">>> varFechaCreacionDesde: "+this.varFechaCreacionDesde.toISOString);
    console.log(">>> varFechaCreacionHasta: "+this.varFechaCreacionHasta.toISOString);
    console.log(">>> varIdTema: "+this.varIdTema);
    console.log(">>> varIdIdioma: "+this.varIdIdioma);
    console.log(">>> varIdCentroEstudios: "+this.varIdCentroEstudios);

    this.tesisService.ConsultarTesisComplejo(
                this.varTitulo, 
                this.varFechaCreacionDesde.toISOString(), 
                this.varFechaCreacionHasta.toISOString(), 
                this.varEstado ? 1 : 0, 
                this.varIdTema, 
                this.varIdIdioma, 
                this.varIdCentroEstudios).subscribe(
          x => {
                this.dataSource = x;
                this.dataSource.paginator = this.paginator;
          }
    );
    console.log(">>> Filtrar [fin]");
  }

  exportarPDF() {

    this.tesisService.generateDocumentReport( 
              this.varTitulo, 
              this.varFechaCreacionDesde.toISOString(), 
              this.varFechaCreacionHasta.toISOString(), 
              this.varEstado ? 1 : 0, 
              this.varIdTema, 
              this.varIdIdioma, 
              this.varIdCentroEstudios).subscribe(
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
    this.tesisService.generateDocumentExcel( 
              this.varTitulo, 
              this.varFechaCreacionDesde.toISOString(), 
              this.varFechaCreacionHasta.toISOString(), 
              this.varEstado ? 1 : 0, 
              this.varIdTema, 
              this.varIdIdioma, 
              this.varIdCentroEstudios).subscribe(
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
