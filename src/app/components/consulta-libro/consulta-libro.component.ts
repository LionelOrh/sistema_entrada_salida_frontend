import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Editorial } from '../../models/editorial.model';
import { LibroService } from '../../services/libro.service';
import { UtilService } from '../../services/util.service';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-consulta-libro',
  templateUrl: './consulta-libro.component.html',
  styleUrls: ['./consulta-libro.component.css']
})
export class ConsultaLibroComponent implements OnInit {

//Grila
dataSource: any;
 //Clase para la paginacion
 @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
 //Cabecera
 displayedColumns = ["idLibro", "titulo", "anio", "serie","estado", "categoriaLibro", "estadoPrestamo", "tipoLibro", "editorial"];

 lstTipo: DataCatalogo[] = [];
 lstCategoria: DataCatalogo[] = [];
 lstEstado: DataCatalogo[] = [];
 lstEditorial: Editorial[] = [];

  //PARA LOS FILTROS
  varTitulo: string = "";
  varAnio: number = 0;
  varSerie: string = "";
  varEstado: boolean = false;
  varIdCateregoriaLibro: number = -1;
  varIdEstadoPrestamo: number = -1;
  varIdTipoLibro: number = -1;
  varIdEditorial: number = -1;

  constructor(private utilService: UtilService, private serviceLibro: LibroService) { }
  ngOnInit(): void {
    this.utilService.listaCategoriaDeLibro().subscribe(
      x => this.lstCategoria = x
    );
    this.utilService.listaEstadoLibro().subscribe(
      x => this.lstEstado = x
    );
    this.utilService.listaTipoLibroRevista().subscribe(
      x => this.lstTipo = x
    );
    this.utilService.listaEditorial().subscribe(
      x => this.lstEditorial = x
    );
   
  }

  filtrar() {
    console.log(">>> Filtrar [ini]");
    console.log(">>> varTitulo: " + this.varTitulo);
    console.log(">>> varAnio: " + this.varAnio);
    console.log(">>> varSerie: " + this.varSerie);
    console.log(">>> varEstado: " + this.varEstado);
    console.log(">>> varIdCateregoriaLibro: " + this.varIdCateregoriaLibro);
    console.log(">>> varIdEstadoPrestamo: " + this.varIdEstadoPrestamo);
    console.log(">>> varIdTipoLibro: " + this.varIdTipoLibro);
    console.log(">>> varIdEditorial: " + this.varIdEditorial);

    
    this.serviceLibro.ConsultaLibroComplejo(
      this.varTitulo,
      this.varAnio,
      this.varSerie,
      this.varEstado? 1 : 0,
      this.varIdCateregoriaLibro,
      this.varIdEstadoPrestamo,
      this.varIdTipoLibro,
    this.varIdEditorial).subscribe(
        x => {
          this.dataSource = x;
          this.dataSource.paginator = this.paginator;
        }
      );
    console.log(">>> Filtrar [fin]");
}

}