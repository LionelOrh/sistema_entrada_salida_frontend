import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Alumno } from '../../models/alumno.model';
import { AlumnoService } from '../../services/alumno.service';
import { TokenService } from '../../security/token.service';
import { UtilService } from '../../services/util.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent,ReactiveFormsModule],
  selector: 'app-crud-alumno-add',
  templateUrl: './crud-alumno-add.component.html',
  styleUrls: ['./crud-alumno-add.component.css']
})
export class CrudAlumnoAddComponent {
  ltsPais: Pais[] = []
  ltsModalidad: DataCatalogo[] = []

  objAlumno: Alumno = {
    nombres: "",
    apellidos: "",
    telefono: "",
    celular: "",
    dni: "",
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

  formsRegistraCrud = this.FormBuilder.group({
    validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaApellido: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaTelefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
    validaCelular: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
    validaDni: ['', [Validators.required, Validators.pattern('[0-8]{8}')]],
    validaCorreo: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')]],
    validaTipoSangre: ['', [Validators.required, Validators.pattern('^[ABO][+-]?$|^(A|B|AB|O)(\\+|-)$-----------------')]],
    validaFecha: ['', [Validators.required]],
    validaPais: ['', Validators.min(1)],
    validaModalidad: ['', Validators.min(1)],
  });
  //Avace CRUD
  constructor(private utilService: UtilService,
    private tokenService: TokenService,
    private alumnoService: AlumnoService,
    private FormBuilder: FormBuilder) {
    this.utilService.listaPais().subscribe(
      x => this.ltsPais = x
    );
    this.utilService.listaModalidadAlumno().subscribe(
      x => this.ltsModalidad = x
    );
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }
  registra(){
    if (this.formsRegistraCrud.valid){
    this.objAlumno.usuarioActualiza=this.objUsuario;
    this.objAlumno.usuarioRegistro = this.objUsuario;

    this.alumnoService.registrarCrud(this.objAlumno).subscribe(
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
      telefono: "",
      celular: "",
      dni: "",
      correo: "",
      tipoSangre: "",
      fechaNacimiento: undefined,
      pais: { idPais: -1 },
      modalidad: { idDataCatalogo: -1 }
    };
    this.formsRegistraCrud.reset();
    
}
}
}

