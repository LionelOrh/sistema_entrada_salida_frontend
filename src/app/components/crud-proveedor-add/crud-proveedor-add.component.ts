import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Proveedor } from '../../models/proveedor.model';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { ProveedorService } from '../../services/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-crud-proveedor-add',
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  templateUrl: './crud-proveedor-add.component.html',
  styleUrls: ['./crud-proveedor-add.component.css']
})
export class CrudProveedorAddComponent {
  lstPais: Pais[] = [];
  lstTipo: DataCatalogo[] = []; 
  objProveedor: Proveedor ={
        razonsocial: "",
        ruc:"",
        direccion: "",
        telefono:"",
        celular:"",
        contacto:"",
        pais:{
          idPais:-1
        },
        tipoProveedor:{
          idDataCatalogo:-1
      }
    }
    objUsuario: Usuario = {} ;
    constructor(private utilService: UtilService, 
      private tokenService: TokenService,
      private proveedorService: ProveedorService){
        this.utilService.listaTipoProveedor().subscribe(
          x =>  this.lstTipo = x
    );
  this.utilService.listaPais().subscribe(
    x =>  this.lstPais = x
  );
  this.objUsuario.idUsuario = tokenService.getUserId();
}
registra(){
  this.objProveedor.usuarioActualiza = this.objUsuario;
  this.objProveedor.usuarioRegistro = this.objUsuario;
  this.proveedorService.registrarCrud(this.objProveedor).subscribe(
    x=>{
      Swal.fire({
        icon: 'info',
        title: 'Resultado del Registro',
        text: x.mensaje,
      })
    },
  );
}
}
