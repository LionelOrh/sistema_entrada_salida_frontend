import { Component, Inject } from '@angular/core';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Sala } from '../../models/sala.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { SalaService } from '../../services/sala.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudAlumnoAddComponent } from '../crud-alumno-add/crud-alumno-add.component';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-sala-add',
  templateUrl: './crud-sala-add.component.html',
  styleUrls: ['./crud-sala-add.component.css']
})
export class CrudSalaAddComponent {

  lstTipoSala: DataCatalogo[] = [];
  lstSede: DataCatalogo[] = [];
  lstEstadoReserva: DataCatalogo[] = [];

  objSala: Sala ={
    numero: "",
    piso: 0,
    numAlumnos : 0,
    recursos: "",
    tipoSala:{
        idDataCatalogo:-1
    },
    sede:{
      idDataCatalogo:-1
    },
    estadoReserva:{
      idDataCatalogo:-1
  }
  };

  objUsuario: Usuario = {} ;


  formsRegistra = this.formBuilder.group({ 
      validaNumero: ['', [Validators.required, Validators.pattern('^[A-ZÑ]\\d{3}$')],this.validarNumero.bind(this)], 
      validaPiso: ['', [Validators.required, Validators.min(1),Validators.max(10)]], 
      validaNumAlumno: ['', [Validators.required, Validators.min(1),Validators.max(5)]], 
      validaRecursos: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑ\\s,]{3,60}$')]], 
      validaTipoSala: ['', Validators.min(1)] , 
      validaSede: ['', Validators.min(1)] , 
      validaEstadoReserva: ['', Validators.min(1)], 
  });

  constructor(private utilService: UtilService, 
    private tokenService: TokenService,
    private salaService: SalaService,
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CrudAlumnoAddComponent>) { 

    this.utilService.listaTipoSala().subscribe(
          x =>  this.lstTipoSala = x
    );
    this.utilService.listaSede().subscribe(
      x =>  this.lstSede = x
    );
    this.utilService.listaEstadoSala().subscribe(
      x =>  this.lstEstadoReserva = x
    );
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  salir(): void {
    this.dialogRef.close();
  }
  registra(){
    if (this.formsRegistra.valid){
      this.objSala.usuarioActualiza = this.objUsuario;
      this.objSala.usuarioRegistro = this.objUsuario;
      this.salaService.registrar(this.objSala).subscribe(
        x=>{
          Swal.fire({
            icon: 'info',
            title: 'Resultado del Registro',
            text: x.mensaje,
          });

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
  validarNumero(control: FormControl) {
    return this.salaService.validarNumero(control.value).pipe(
      map((response: any) => {
        return response.valid ? null : { numeroRepetido: true };
      })
    );
  }

  
}