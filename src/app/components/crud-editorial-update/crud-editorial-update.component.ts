import { Component, Inject, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Editorial } from '../../models/editorial.model';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { EditorialService } from '../../services/editorial.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-crud-editorial-update',
  templateUrl: './crud-editorial-update.component.html',
  styleUrls: ['./crud-editorial-update.component.css'],
  providers: [provideNativeDateAdapter()],
})
export class CrudEditorialUpdateComponent {
  lstPais: Pais[] = [];
  lstTipo: DataCatalogo[] = [];
  fecha = new FormControl(new Date());

  objEditorial: Editorial ={
    razonSocial: "",
    direccion: "",
    ruc:"",
    gerente:"",
    fechaCreacion : new Date(),
    pais:{
      idPais:-1
    }
}
objUsuario: Usuario = {} ;

  constructor(private utilService: UtilService, 
              private tokenService: TokenService,
              private editorialService: EditorialService,
              @Inject(MAT_DIALOG_DATA) public data: any){
            

            data.fechaCreacion = new Date( new Date(data.fechaCreacion).getTime() + (1000 * 60 * 60 * 24));
            this.objEditorial = data; 

            console.log(">>>> [ini] >>> objRevista");
            console.log(this.objEditorial);
            this.utilService.listaPais().subscribe(
              x =>  this.lstPais = x
            );
        this.objUsuario.idUsuario = tokenService.getUserId();
        
  }
  

  actualizar() {
    this.objEditorial.usuarioActualiza = this.objUsuario;
    this.objEditorial.usuarioRegistro = this.objUsuario;
    this.editorialService.actualizarCrud(this.objEditorial).subscribe((x) => {
      Swal.fire({
        icon: 'info',
        title: 'Resultado del Registro',
        text: x.mensaje,
      });
    });
  }

  
}
