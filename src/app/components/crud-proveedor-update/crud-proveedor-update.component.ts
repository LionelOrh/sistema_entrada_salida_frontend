import { Component, Inject, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
@Component({
  standalone: true,
  selector: 'app-crud-proveedor-update',
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  templateUrl: './crud-proveedor-update.component.html',
  styleUrls: ['./crud-proveedor-update.component.css'],
  providers: [provideNativeDateAdapter()],
})
export class CrudProveedorUpdateComponent {

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
    objUsuario: Usuario = {} 
    constructor(private utilService: UtilService, 
      private tokenService: TokenService,
      private proveedorService: ProveedorService,
      @Inject(MAT_DIALOG_DATA) public data: any){
    

    data.fechaCreacion = new Date( new Date(data.fechaCreacion).getTime() + (1000 * 60 * 60 * 24));
    this.objProveedor = data; 

    console.log(">>>> [ini] >>> objProveedor");
    console.log(this.objProveedor);
    this.utilService.listaTipoProveedor().subscribe(
      x =>  this.lstTipo = x
);
    this.utilService.listaPais().subscribe(
      x =>  this.lstPais = x
    );
this.objUsuario.idUsuario = tokenService.getUserId();

}


actualizar() {
this.objProveedor.usuarioActualiza = this.objUsuario;
this.objProveedor.usuarioRegistro = this.objUsuario;
this.proveedorService.actualizarCrud(this.objProveedor).subscribe((x) => {
Swal.fire({
icon: 'info',
title: 'Resultado del Registro',
text: x.mensaje,
});
});
}


}
