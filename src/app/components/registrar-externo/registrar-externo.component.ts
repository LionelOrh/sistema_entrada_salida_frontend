import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { TipoDocumento } from '../../models/tipoDocumento.model';
import { UtilService } from '../../services/util.service';
import { ExternoService } from '../../services/externo.service';
import { TokenService } from '../../security/token.service';
import { Externo } from '../../models/externo.model';
import { Usuario } from '../../models/usuario.model';
 
@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],

  selector: 'app-registrar-externo',
  templateUrl: './registrar-externo.component.html',
  styleUrls: ['./registrar-externo.component.css'] 
})
export class RegistrarExternoComponent{
  lstTipoDoc: TipoDocumento[] = [];
  
  externo: Externo = {
    nombres: "",
    apellidos: "",
    celular: "",
    nroDoc: "",
    motivo: "",
    tipoDoc: {
      idTipoDoc: -1
    }
  }
  objUsuario: Usuario = {};

  constructor(
    private utilService: UtilService,
    private tokenService: TokenService,
    private externoService: ExternoService,
    private formBuilder: FormBuilder,
  ) {
    utilService.listaTipoDocumento().subscribe(
      x => this.lstTipoDoc = x
    );

    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }
  
}