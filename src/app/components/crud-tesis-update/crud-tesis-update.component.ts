import { Component, Inject, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Tesis } from '../../models/tesis.model';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { TesisService } from '../../services/tesis.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-tesis-update',
  templateUrl: './crud-tesis-update.component.html',
  styleUrls: ['./crud-tesis-update.component.css'],
  providers: [provideNativeDateAdapter()],
})

export class CrudTesisUpdateComponent {

  lstTema: DataCatalogo[] = [];
  lstIdioma: DataCatalogo[] = [];
  lstCentroEstudios: DataCatalogo[] = [];
  fecha = new FormControl(new Date());

  formsActualiza = this.formBuilder.group({ 
    validaTitulo: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{5,45}')]] , 
    validaFechaCreacion: ['', [Validators.required, this.validateFechaCreacion]] , 
    validaTema: ['', Validators.min(1)] , 
    validaIdioma: ['', Validators.min(1)] , 
    validaCentroEstudios: ['', Validators.min(1)] ,    
  });

  objTesis: Tesis ={
    titulo: "",
    fechaCreacion : new Date(),
    tema:{
      idDataCatalogo:-1
    },
    idioma:{
      idDataCatalogo:-1
    },
    centroEstudios:{
      idDataCatalogo:-1
    }
  };
  objUsuario: Usuario = {};

  constructor(private utilService: UtilService, 
              private tokenService: TokenService,
              private tesisService: TesisService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder : FormBuilder){

                data.fechaCreacion = new Date( new Date(data.fechaCreacion).getTime() + (1000 * 60 * 60 * 24));
                this.objTesis = data; 

                console.log(">>>> [ini] >>> objTesis");
                console.log(this.objTesis);
                this.utilService.listaTemaTesis().subscribe(
                  x =>  this.lstTema = x
                );
                this.utilService.listaIdioma().subscribe(
                      x =>  this.lstIdioma = x
                );
                this.utilService.listaCentroEstudios().subscribe(
                      x =>  this.lstCentroEstudios = x
                );
                this.objUsuario.idUsuario = tokenService.getUserId();
              }
  
// Función de validación personalizada para validar que la fecha sea posterior al 1 de enero de 1975
  validateFechaCreacion(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaCreacion = new Date(control.value);
    const fechaLimite = new Date('1975-01-01');

    if (control.value === '') {
        return { 'required': true }; // Devuelve 'required' si la fecha es requerida
    }

    if (fechaCreacion < fechaLimite) {
        return { 'fechaInvalida': true }; // Devuelve 'fechaInvalida' si la fecha no es posterior a 1975
    }
    return null;
}

  actualizar() {
    this.objTesis.usuarioActualiza = this.objUsuario;
    this.objTesis.usuarioRegistro = this.objUsuario;
    this.tesisService.actualizarCrud(this.objTesis).subscribe((x) => {
      Swal.fire({
        icon: 'info',
        title: 'Resultado del Registro',
        text: x.mensaje,
      });
    });
  }

  
}
