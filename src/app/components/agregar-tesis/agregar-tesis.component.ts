import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Tesis } from '../../models/tesis.model';
import { Usuario } from '../../models/usuario.model';
import { TesisService } from '../../services/tesis.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';


@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],

  selector: 'app-agregar-tesis',
  templateUrl: './agregar-tesis.component.html',
  styleUrls: ['./agregar-tesis.component.css']
})
export class AgregarTesisComponent {

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

  formsRegistra = this.formBuilder.group({ 
    validaTitulo: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{5,45}')]] , 
    validaFechaCreacion: ['', [Validators.required, this.validateFechaCreacion]] , 
    validaTema: ['', [Validators.required, Validators.min(1)]] , 
    validaIdioma: ['', [Validators.required, Validators.min(1)]] , 
    validaCentroEstudios: ['', [Validators.required, Validators.min(1)]] ,   
  });

  constructor(private tesisService:TesisService , 
              private utilService: UtilService, 
              private tokenService: TokenService, 
              private formBuilder: FormBuilder) {
    utilService.listaTemaTesis().subscribe(
      x   =>   this.lstTema=x
    )

    utilService.listaIdioma().subscribe(
      x   =>   this.lstIdioma=x
    )

    utilService.listaCentroEstudios().subscribe(
      x   =>   this.lstCentroEstudios=x
    )
    this.objUsuario.idUsuario = tokenService.getUserId();
}

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

registra() {
  if (this.formsRegistra.valid) {
    this.objTesis.usuarioActualiza = this.objUsuario;
    this.objTesis.usuarioRegistro = this.objUsuario;
    this.tesisService.registrarCrud(this.objTesis).subscribe(
      x => {
        Swal.fire({
          icon: 'info',
          title: 'Resultado del Registro',
          text: x.mensaje,
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            // Limpia el formulario
            this.formsRegistra.reset();
            // Borra los errores
            Object.keys(this.formsRegistra.controls).forEach(controlName => {
              this.formsRegistra.get(controlName)?.setErrors(null);
            });
            // Recarga la página
            window.location.reload();
          }
        });
      }
    );
  }
}

}
