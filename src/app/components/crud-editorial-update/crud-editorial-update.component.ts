import { Component, Inject, OnInit } from '@angular/core';
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
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';

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
  selector: 'app-crud-editorial-update',
  templateUrl: './crud-editorial-update.component.html',
  styleUrls: ['./crud-editorial-update.component.css'],
  providers: [provideNativeDateAdapter()],
})
export class CrudEditorialUpdateComponent {
  lstPais: Pais[] = [];
  lstTipo: DataCatalogo[] = [];
  fecha = new FormControl(new Date());

  formsActualiza = this.formBuilder.group({ 
    validarazonSocial: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{4,40}')]],
    validadireccion: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
    validaruc: ['', [Validators.required, Validators.pattern('[0-9]{11}'), rucStartsWith10], [rucUnique(this.editorialService)]],
    validagerente: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,50}$')]],
    validafechaCreacion: ['', [Validators.required, dateFrom1980Onwards]],
    validaPais: ['', [Validators.min(1)]],
});

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
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder : FormBuilder){
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
