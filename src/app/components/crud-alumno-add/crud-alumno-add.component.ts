import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { AppMaterialModule } from '../../app.material.module';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Alumno } from '../../models/alumno.model';
import { AlumnoService } from '../../services/alumno.service';
import { TokenService } from '../../security/token.service';
import { UtilService } from '../../services/util.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [AppMaterialModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-alumno-add',
  templateUrl: './crud-alumno-add.component.html',
  styleUrls: ['./crud-alumno-add.component.css']
})
export class CrudAlumnoAddComponent implements OnInit {

  formsRegistraCrud = this.formBuilder.group({
    validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaApellido: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaTelefono: ['', [Validators.required, Validators.pattern('^9[0-9]{8}$')]],
    validaCelular: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    validaDni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    validaCorreo: ['', [Validators.required, Validators.pattern('^I(200[0-9]|201[0-9]|202[0-4])([0-9]{2})([0-9]{3})@cibertec\.edu\.pe$')]],
    validaTipoSangre: ['', Validators.required],
    validaFecha: ['', [Validators.required, this.mayorDeEdadValidator()]],
    validaPais: ['', Validators.min(1)],
    validaModalidad: ['', Validators.min(1)],
  });

  ltsPais: Pais[] = [];
  ltsModalidad: DataCatalogo[] = [];

  objAlumno: Alumno = {
    nombres: "",
    apellidos: "",
    telefono: "",
    celular: "",
    dni: "",
    correo: "",
    tipoSangre: "",
    fechaNacimiento: new Date(),
    pais: { idPais: -1 },
    modalidad: { idDataCatalogo: -1 }
  };

  objUsuario: Usuario = {};

  constructor(
    private utilService: UtilService,
    private tokenService: TokenService,
    private alumnoService: AlumnoService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CrudAlumnoAddComponent>
  ) {
    this.utilService.listaPais().subscribe(x => this.ltsPais = x);
    this.utilService.listaModalidadAlumno().subscribe(x => this.ltsModalidad = x);
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  ngOnInit() { }

  private mayorDeEdadValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = moment(control.value);
      const hoy = moment();
      const edad = hoy.diff(fechaNacimiento, 'years');
      return edad >= 18 ? null : { mayorDeEdad: true };
    };
  }
  NombreExistente: boolean = false;
  TelefonoExistente: boolean = false;
  DniExistente: boolean = false;

  registra() {
    if (this.formsRegistraCrud.valid) {
      this.objAlumno.usuarioActualiza = this.objUsuario;
      this.objAlumno.usuarioRegistro = this.objUsuario;

      this.alumnoService.registrarCrud(this.objAlumno).subscribe(
        x => {
          if (x.mensaje === "El alumno " + this.objAlumno.nombres + " ya existe") {
            this.NombreExistente = true;
            this.formsRegistraCrud.controls.validaNombre.setErrors({ 'NombreExistente': true });
          }
          else if (x.mensaje === "El teléfono " + this.objAlumno.telefono + " ya existe") {
            this.TelefonoExistente = true;
            this.formsRegistraCrud.controls.validaTelefono.setErrors({ 'TelefonoExistente': true });
          } 
          else if (x.mensaje === "El Dni " + this.objAlumno.dni + " ya existe") {
            this.DniExistente = true;
            this.formsRegistraCrud.controls.validaDni.setErrors({ 'DniExistente': true });
          }
          else {
            this.NombreExistente = false;
            this.TelefonoExistente = false;
            this.DniExistente = true;
            Swal.fire({
              icon: 'success',
              title: 'Resultado del Registro',
              text: x.mensaje,
              showConfirmButton: true,
              confirmButtonText: 'OK'
            }).then(() => {
              // Borra los errores
              Object.keys(this.formsRegistraCrud.controls).forEach(controlName => {
                this.formsRegistraCrud.get(controlName)?.setErrors(null);
              });
              this.formsRegistraCrud.reset();
            });
          }
        }
      );
    }
  }
  
  
    }