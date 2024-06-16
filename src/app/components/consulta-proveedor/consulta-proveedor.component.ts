import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-consulta-proveedor',
  templateUrl: './consulta-proveedor.component.html',
  styleUrls: ['./consulta-proveedor.component.css']
})
export class ConsultaProveedorComponent implements OnInit {

  //Grila
dataSource:any;

//Clase para la paginacion
@ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

 //Cabecera
 displayedColumns = ["idProveedor","razonsocial","ruc","direccion","telefono","celular","contacto", "estado","pais","tipoProveedor"];
//Para el combobox

lstPais: Pais[] = [];
  lstTipo: DataCatalogo[] = [];

      varRazonSocial: string = "";
      varRuc: string = "";
      varDireccion: string = "";
      varTelefono: string = "";
      varCelular: string = "";
      varContacto: string = "";
      varEstado: boolean = false;
      varIdPais: number = -1;
      varIdTipoProveedor: number = -1;
  constructor(private utilService:UtilService, private proveedorService : ProveedorService) { }

  ngOnInit() {
    this.utilService.listaPais().subscribe(
           x =>  this.lstPais = x
     );
     this.utilService.listaTipoProveedor().subscribe(
      x => this.lstTipo = x
    );
  }
    filtrar(){
      console.log(">>> Filtrar [ini]");
    console.log(">>> varRazonSocial: " + this.varRazonSocial);
    console.log(">>> varRuc: " + this.varRuc);
    console.log(">>> varDireccion: " + this.varDireccion);
    console.log(">>> varTelefono: " + this.varTelefono);
    console.log(">>> varCelular: " + this.varCelular);
    console.log(">>> varContacto: " + this.varContacto);
    console.log(">>> varEstado: " + this.varEstado);
    console.log(">>> varIdPais: " + this.varIdPais);
    console.log(">>> varIdTipoProveedor: " + this.varIdTipoProveedor);
    
    
    this.proveedorService.ConsultarProveedorComplejo(
      this.varRazonSocial, 
      this.varRuc,
      this.varDireccion,
      this.varTelefono,
      this.varCelular,
      this.varContacto,
      this.varEstado ? 1 : 0, 
      this.varIdPais,
      this.varIdTipoProveedor).subscribe(
x => {
      this.dataSource = x;
      this.dataSource.paginator = this.paginator;
}
);
console.log(">>> Filtrar [fin]");
}

exportarPDF() {

  this.proveedorService.generateDocumentReport( 
    this.varRazonSocial, 
    this.varRuc,
    this.varDireccion,
    this.varTelefono,
    this.varCelular,
    this.varContacto,
    this.varEstado ? 1 : 0, 
    this.varIdPais,
    this.varIdTipoProveedor).subscribe(
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
  console.log(">>> varRazonSocial: " + this.varRazonSocial);
  console.log(">>> varRuc: " + this.varRuc);
  console.log(">>> varDireccion: " + this.varDireccion);
  console.log(">>> varTelefono: " + this.varTelefono);
  console.log(">>> varCelular: " + this.varCelular);
  console.log(">>> varContacto: " + this.varContacto);
  console.log(">>> varEstado: " + this.varEstado);
  console.log(">>> varIdPais: " + this.varIdPais);
  console.log(">>> varIdTipoProveedor: " + this.varIdTipoProveedor);
  
      
      
  this.proveedorService.generateDocumentExcel( 
    this.varRazonSocial, 
    this.varRuc,
    this.varDireccion,
    this.varTelefono,
    this.varCelular,
    this.varContacto,
    this.varEstado ? 1 : 0, 
    this.varIdPais,
    this.varIdTipoProveedor).subscribe(
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

