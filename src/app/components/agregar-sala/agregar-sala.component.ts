import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Sala } from '../../models/sala.model';
import { Usuario } from '../../models/usuario.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { SalaService } from '../../services/sala.service';

import Swal from 'sweetalert2'

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent,ReactiveFormsModule],
  selector: 'app-agregar-sala',
  templateUrl: './agregar-sala.component.html',
  styleUrls: ['./agregar-sala.component.css']
})
export class AgregarSalaComponent{

  lstTipoSala: DataCatalogo[] = [];
  lstSede: DataCatalogo[] = [];
  lstEstadoReserva: DataCatalogo[] = [];

  objSala: Sala ={
    numero: "",
    piso: 0,
    numAlumnos: 0,
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

      validaNumero: ['', [Validators.required]] , 
      validaPiso: ['', [Validators.required, Validators.pattern('[0-9]{1,2}')]] , 
      validaNumAlumnos: ['', [Validators.required, Validators.pattern('[0-9]{1,3}')] ], 
      validaRecursos: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,40}')]], 
      validaTipoSala: ['', Validators.min(1)] , 
      validaSede: ['', Validators.min(1)] , 
      validaEstadoReserva: ['', Validators.min(1)] , 
     });


    
  constructor(private utilService: UtilService, 
              private tokenService: TokenService,
              private salaService: SalaService,
              private formBuilder: FormBuilder){
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
  registra(){
    if (this.formsRegistra.valid){

        this.objSala.usuarioActualiza = this.objUsuario;
        this.objSala.usuarioRegistro = this.objUsuario;
        this.salaService.registrar(this.objSala).subscribe(
          x=>
            Swal.fire({
              icon: 'info',
              title: 'Resultado del Registro',
              text: x.mensaje,
            })
        );

            this.objSala ={
              numero: "",
              piso: 0,
              numAlumnos: 0,
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
              this.formsRegistra.reset();

          }           
  }
}

