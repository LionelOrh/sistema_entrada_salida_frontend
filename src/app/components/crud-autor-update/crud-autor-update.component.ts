import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { Autor } from '../../models/autor.model';
import { Usuario } from '../../models/usuario.model';
import { AutorService } from '../../services/autor.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-autor-update',
  templateUrl: './crud-autor-update.component.html',
  styleUrls: ['./crud-autor-update.component.css'],
  providers: [provideNativeDateAdapter()],
})

export class CrudAutorUpdateComponent {

  lstPais: Pais[] = [];
  lstGrado: DataCatalogo[] = [];
  fecha = new FormControl(new Date());
  
  //PARA LAS VALIDACIONES
  formsActualizar = this.formBuilder.group({
    validaNombres: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{4,40}')]],
    validaApellidos: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{4,40}')]],
    validaFechaNacimiento: ['', [Validators.required, this.validateFechaNacimiento]] , 
    validaTelefono: ['', [Validators.required, Validators.pattern('018[0-9]{6}')]],
    validaCelular: ['', [Validators.required, Validators.pattern('9[0-9]{8}')]],
    validaOrcid: ['', [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}')]],
    validaPais: ['', Validators.min(1)],
    validaGrado: ['', Validators.min(1)],
  });

  autor: Autor = {
    nombres: "",
    apellidos: "",
    fechaNacimiento: new Date(),
    telefono: "",
    celular: "",
    orcid: "",
    pais: {
      idPais: -1
    },
    grado: {
      idDataCatalogo: -1
    }
  };

  objUsuario: Usuario = {};

  constructor(
    private autorService: AutorService, 
    private utilService: UtilService, 
    private tokenService: TokenService,
    private formBuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    data.fechaNacimiento = new Date( new Date(data.fechaNacimiento).getTime() + (1000 * 60 * 60 * 24));
    this.autor = data;

    console.log(">>>> [ini] >>> autor");
    console.log(this.autor);

    utilService.listaPais().subscribe(
      x => this.lstPais = x
    );

    utilService.listaGradoAutor().subscribe(
      x => this.lstGrado = x
    );

    this.objUsuario.idUsuario = tokenService.getUserId();
  }


  validateFechaNacimiento(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaNacimiento = new Date(control.value);
    const fechaActual = new Date();
    
    if (control.value === '') {
        return { 'required': true }; // Devuelve 'required' si la fecha es requerida
    }

    const edadActual = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    const cumpleañosEsteAño = new Date(fechaActual.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());
    
    if (edadActual < 18 || (edadActual === 18 && fechaActual < cumpleañosEsteAño)) {
        return { 'menorEdad': true }; // Devuelve 'menorEdad' si la persona es menor de 18 años
    }

    return null;
  }

    actualizar() {
    if (this.formsActualizar.valid) {
      this.autor.usuarioActualiza = this.objUsuario;
      this.autor.usuarioRegistro = this.objUsuario;

      this.autorService.actualizarCrud(this.autor).subscribe((x) => {
        Swal.fire({
          icon: 'info',
          title: 'Resultado de la Actualización',
          text: x.mensaje,
        });
      });
    }
  }
}

