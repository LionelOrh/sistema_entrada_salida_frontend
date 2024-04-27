import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class AgregarTesisComponent implements OnInit {

  lstTema: DataCatalogo[] = [];
  lstIdioma: DataCatalogo[] = [];
  lstCentroEstudios: DataCatalogo[] = [];
  tesis: Tesis ={
      titulo: "",
      fechaCreacion: new Date,
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
    validaTitulo: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]], 
    validaFechaCreacion: ['', [Validators.required] ] , 
    validaTema: ['', Validators.min(1)],
    validaIdioma: ['', Validators.min(1)] ,  
    validaCentroEstudios: ['', Validators.min(1)], 
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

  ngOnInit() {
    if (this.formsRegistra.valid){
      this.tesis.usuarioActualiza = this.objUsuario;
        this.tesis.usuarioRegistro = this.objUsuario;
        this.tesisService.registrar(this.tesis).subscribe(
          x=>{
            Swal.fire({
              icon: 'success',
              title: 'Resultado del Registro',
              text: x.mensaje,
            })
          },
        );
    }
  }
}
