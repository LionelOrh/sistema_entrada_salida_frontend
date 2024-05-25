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

import Swal from 'sweetalert2'
import { BrowserModule } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
// Validador personalizado para comprobar si el RUC comienza con 10
function rucStartsWith10(control: AbstractControl): ValidationErrors | null {
  const ruc = control.value;
  if (ruc && !ruc.startsWith('10')) {
    return { startsWith10: true };
  }
  return null;
}
// Validador  para verificar si el RUC es único
function rucUnique(editorialService: EditorialService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return editorialService.validaRucActualiza(control.value).pipe(
      debounceTime(500),
      map(response => (response.valid ? null : { rucNotUnique: true })),
      catchError(() => of(null))
    );
  };
}
// Validador  para verificar si la razon social es única
function razonSocialUnique(editorialService: EditorialService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return editorialService.validaRazonSocial(control.value).pipe(
      debounceTime(500),
      map(response => (response.valid ? null : { razonSocialNotUnique: true })),
      catchError(() => of(null))
    );
  };
}

// Validador personalizado para comprobar si la fecha es de 1980 en adelante
function dateFrom1980Onwards(control: AbstractControl): ValidationErrors | null {
  const date = new Date(control.value);
  if (date.getFullYear() < 1980) {
    return { dateFrom1980Onwards: true };
  }
  return null;
}
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
        validarazonSocial: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{4,40}')], [razonSocialUnique(this.editorialService)]],
        validadireccion: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
        validaruc: ['', [Validators.required, Validators.pattern('[0-9]{11}'), rucStartsWith10], [rucUnique(this.editorialService)]],
        validagerente: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,50}$')]],
        validafechaCreacion: ['', [Validators.required, dateFrom1980Onwards]],
        validaPais: ['', [Validators.min(1)]],
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