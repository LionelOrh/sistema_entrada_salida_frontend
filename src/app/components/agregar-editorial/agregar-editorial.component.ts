import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Editorial } from '../../models/editorial.model';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { EditorialService } from '../../services/editorial.service';

import Swal from 'sweetalert2'
import { BrowserModule } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-agregar-editorial',
  templateUrl: './agregar-editorial.component.html',
  styleUrls: ['./agregar-editorial.component.css']
})
export class AgregarEditorialComponent {

      lstPais: Pais[] = [];

      objEditorial: Editorial ={
            razonSocial: "",
            direccion: "",
            ruc:"",
            gerente:"",
            fechaCreacion : undefined,
            pais:{
              idPais:-1
            }
        }
        objUsuario: Usuario = {} ;

      formsRegistra = this.formBuilder.group({  
     validarazonSocial: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,100}')]],
    validadireccion: ['', [Validators.required, Validators.maxLength(100)]],
    validaruc: ['', [Validators.required, Validators.pattern('[0-9]{11}')]], 
    validagerente: ['', [Validators.required, Validators.maxLength(50)]],
    validafechaCreacion: ['', [Validators.required] ] , 
    validaPais: ['', Validators.min(1)],
      });

      constructor(private utilService: UtilService, 
                  private tokenService: TokenService,
                  private  editorialService: EditorialService,
                  private formBuilder: FormBuilder){
              
              this.utilService.listaPais().subscribe(
                x =>  this.lstPais = x
              );
              this.objUsuario.idUsuario = tokenService.getUserId();
      }
      registra(){
        if (this.formsRegistra.valid){

            this.objEditorial.usuarioActualiza = this.objUsuario;
            this.objEditorial.usuarioRegistro = this.objUsuario;
            this.editorialService.registrar(this.objEditorial).subscribe(
              x=>{
                Swal.fire({
                  icon: 'info',
                  title: 'Resultado del Registro',
                  text: x.mensaje,
                });        
         this.formsRegistra.reset();
         
         this.objEditorial = {
           razonSocial: "",
           direccion: "",
           ruc: "",
           gerente: "",
           fechaCreacion: undefined,
           pais: {
             idPais: -1
           }
         };
       },
       error => {
         console.error('Error al registrar:', error);
       }
     );
   }
 }
}