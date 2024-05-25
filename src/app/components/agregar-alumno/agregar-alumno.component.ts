import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-agregar-alumno',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent,ReactiveFormsModule],
  templateUrl: './agregar-alumno.component.html',
  styleUrls: ['./agregar-alumno.component.css']
})


export class AgregarAlumnoComponent{

  ltsPais: Pais[]=[]
  ltsModalidad: DataCatalogo[]=[]

  objAlumno: Alumno ={
    nombres: "",
    apellidos: "",
    telefono: undefined,
    celular: undefined,
    dni: undefined,
    correo: "",
    tipoSangre: "",
    fechaNacimiento: undefined,
    pais:{
      idPais:-1
    },
    modalidad:{
      idDataCatalogo: -1
    }
}


  objUsuario : Usuario={};

  formsRegistra = this.FormBuilder.group({ 
        validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]] , 
        validaApellido: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]] , 
        validaTelefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')] ] , 
        validaCelular: ['', [Validators.required, Validators.pattern('[0-9]{9}')] ] ,
        validaDni: ['', [Validators.required, Validators.pattern('[0-8]{8}')] ] ,  
        validaCorreo: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')]] ,
        validaTipoSangre: ['', [Validators.required]],
        validaFecha: ['', [Validators.required] ] , 
         validaPais: ['', Validators.min(1)] , 
        validaModalidad: ['', Validators.min(1)] , 
      });

  constructor(private utilService: UtilService, 
    private alumnoService:AlumnoService,
     private tokenService:TokenService, 
     private FormBuilder: FormBuilder ) {
      
    this.utilService.listaPais().subscribe(
      x=> this.ltsPais=x
    );
    this.utilService.listaModalidadAlumno().subscribe(
      x=> this.ltsModalidad= x
    );
    this.objUsuario.idUsuario = this.tokenService.getUserId();
   }

   registra(){
    if (this.formsRegistra.valid){
    this.objAlumno.usuarioActualiza=this.objUsuario;
    this.objAlumno.usuarioRegistro = this.objUsuario;
    this.alumnoService.registra(this.objAlumno).subscribe(
        x =>
          Swal.fire({
            icon: 'success',
            title: 'Resultado del Registro',
            text: x.mensaje,
          })
    );
    this.objAlumno={
      nombres: "",
      apellidos: "",
      telefono: undefined,
      celular: undefined,
      dni: undefined,
      correo: "",
      tipoSangre: "",
      fechaNacimiento: undefined,
      pais:{
        idPais:-1
      },
      modalidad:{
        idDataCatalogo: -1
      }
    },
      this.formsRegistra.reset();
    
}
}
}
