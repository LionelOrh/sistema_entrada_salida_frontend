import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms'; // Agrega AbstractControl
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Tesis } from '../../models/tesis.model';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { TesisService } from '../../services/tesis.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-crud-tesis-add',
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-tesis-add.component.html',
  styleUrls: ['./crud-tesis-add.component.css']
})

export class CrudTesisAddComponent {

  formsRegistra = this.formBuilder.group({ 
    validaTitulo: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{5,45}')]] , 
    validaFechaCreacion: ['', [Validators.required, this.validateFechaCreacion]] , // Agrega la validación personalizada
    validaTema: ['', Validators.min(1)] , 
    validaIdioma: ['', Validators.min(1)] , 
    validaCentroEstudios: ['', Validators.min(1)] ,  
  });

  lstTema: DataCatalogo[] = [];
  lstIdioma: DataCatalogo[] = [];
  lstCentroEstudios: DataCatalogo[] = [];

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
    }
    objUsuario: Usuario = {} ;

  constructor(private utilService: UtilService, 
              private tokenService: TokenService,
              private tesisService: TesisService,
              private formBuilder : FormBuilder  ){
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


  registra(){
    if (this.formsRegistra.valid){
        this.objTesis.usuarioActualiza = this.objUsuario;
        this.objTesis.usuarioRegistro = this.objUsuario;
        this.tesisService.registrarCrud(this.objTesis).subscribe(
          x=>{
            Swal.fire({
              icon: 'info',
              title: 'Resultado del Registro',
              text: x.mensaje,
            })
           //limpia el formulario
           this.formsRegistra.reset();
                    
           //borra los errores
           Object.keys(this.formsRegistra.controls).forEach(x => {
                 this.formsRegistra.get(x)?.setErrors(null);
           });
        },
      );
    }
  }
}
