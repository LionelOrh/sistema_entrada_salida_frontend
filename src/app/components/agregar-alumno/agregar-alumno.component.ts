import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Usuario } from '../../models/usuario.model';
import { AlumnoService } from '../../services/alumno.service';
import { TokenService } from '../../security/token.service';
import { Alumno } from '../../models/alumno.model';
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-agregar-alumno',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-alumno.component.html',
  styleUrls: ['./agregar-alumno.component.css']
})


export class AgregarAlumnoComponent {

  ltsPais: Pais[] = []
  ltsModalidad: DataCatalogo[] = []

  objAlumno: Alumno = {
    nombres: "",
    apellidos: "",
    telefono: undefined,
    celular: undefined,
    dni: undefined,
    correo: "",
    tipoSangre: "",
    fechaNacimiento: undefined,
    pais: {
      idPais: -1
    },
    modalidad: {
      idDataCatalogo: -1
    }
  }


  objUsuario: Usuario = {};

  formsRegistra = this.FormBuilder.group({
    validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaApellido: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaTelefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
    validaCelular: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
    validaDni: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
    validaCorreo: ['', [Validators.required, Validators.pattern('^I(200[0-9]|201[0-9]|202[0-4])([0-9]{2})([0-9]{3})@cibertec\.edu\.pe$')]],
    validaTipoSangre: ['', Validators.required],
    validaFecha: ['', [Validators.required, this.mayorDeEdadValidator()]], // Validación para fecha de nacimiento y mayor de edad
    validaPais: ['', Validators.min(1)],
    validaModalidad: ['', Validators.min(1)],
  });

  constructor(private utilService: UtilService,
    private alumnoService: AlumnoService,
    private tokenService: TokenService,
    private FormBuilder: FormBuilder) {

    this.utilService.listaPais().subscribe(
      x => this.ltsPais = x
    );
    this.utilService.listaModalidadAlumno().subscribe(
      x => this.ltsModalidad = x
    );
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  mayorDeEdadValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = moment(control.value);
      const hoy = moment();
      const edad = hoy.diff(fechaNacimiento, 'years');
      return edad >= 18 ? null : { mayorDeEdad: true };
    };
  }

  registra() {
    if (this.formsRegistra.valid) {
      this.objAlumno.usuarioActualiza = this.objUsuario;
      this.objAlumno.usuarioRegistro = this.objUsuario;
      this.alumnoService.registra(this.objAlumno).subscribe(
        x =>
          Swal.fire({
            icon: 'success',
            title: 'Resultado del Registro',
            text: x.mensaje,
          })
      );
      this.objAlumno = {
        nombres: "",
        apellidos: "",
        telefono: undefined,
        celular: undefined,
        dni: undefined,
        correo: "",
        tipoSangre: "",
        fechaNacimiento: undefined,
        pais: {
          idPais: -1
        },
        modalidad: {
          idDataCatalogo: -1
        }
      },
        this.formsRegistra.reset();

    }
  }
}
