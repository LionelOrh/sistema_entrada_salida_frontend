import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
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
@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-agregar-editorial',
  templateUrl: './agregar-editorial.component.html',
  styleUrls: ['./agregar-editorial.component.css']
})
export class AgregarEditorialComponent {

  lstPais: Pais[] = [];
  objeditorial: Editorial ={
        razonSocial: "",
        direccion: "",
        ruc:"",
        gerente: "",
        fechaCreacion : new Date(),
        pais:{
          idPais:-1
        }
    }
    objUsuario: Usuario = {} ;

  constructor(private utilService: UtilService, 
              private tokenService: TokenService,
              private editorialService: EditorialService){
          this.utilService.listaPais().subscribe(
            x =>  this.lstPais = x
          );
          this.objUsuario.idUsuario = tokenService.getUserId();
  }
  registra(){
        this.objeditorial.usuarioActualiza = this.objUsuario;
        this.objeditorial.usuarioRegistro = this.objUsuario;
        this.editorialService.registrar(this.objeditorial).subscribe(
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


