import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

// Validador personalizado para comprobar si el RUC comienza con 10
function rucStartsWith10(control: AbstractControl): ValidationErrors | null {
  const ruc = control.value;
  if (ruc && !ruc.startsWith('10')) {
    return { startsWith10: true };
  }
  return null;
}
// Validador personalizado para comprobar si la fecha es de 1980 en adelante
function dateFrom1980Onwards(control: AbstractControl): ValidationErrors | null {
  const date = new Date(control.value);
  if (date.getFullYear() < 1980) {
    return { dateFrom1980Onwards: true };
  }
  return null;}
@Component({
  standalone: true,
  selector: 'app-crud-editorial-add',
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent,ReactiveFormsModule],
  templateUrl: './crud-editorial-add.component.html',
  styleUrls: ['./crud-editorial-add.component.css']
})
export class CrudEditorialAddComponent {
    
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
  validarazonSocial: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{4,40}')]],
    validadireccion: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
    validaruc: ['', [Validators.required, Validators.pattern('[0-9]{11}'), rucStartsWith10]],
    validagerente: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,50}$')]],
    validafechaCreacion: ['', [Validators.required, dateFrom1980Onwards]],
    validaPais: ['', [Validators.min(1)]],
   });
   

  constructor(private utilService: UtilService, 
              private tokenService: TokenService,
              private editorialService: EditorialService,
              private formBuilder: FormBuilder ){
          this.utilService.listaPais().subscribe(
            x =>  this.lstPais = x
          );
          this.objUsuario.idUsuario = tokenService.getUserId();

  }
  
  registra(){
        this.objEditorial.usuarioActualiza = this.objUsuario;
        this.objEditorial.usuarioRegistro = this.objUsuario;
        this.editorialService.registrarCrud(this.objEditorial).subscribe(
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

