import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { TipoDocumento } from '../../models/tipoDocumento.model';
import { Proveedor } from '../../models/proveedor.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],

  selector: 'app-acceso-proveedores',
  templateUrl: './acceso-proveedores.component.html',
  styleUrls: ['./acceso-proveedores.component.css']
})
export class AccesoProveedorComponent {
  lstTipoDoc: TipoDocumento[] = [];
  proveedor: Proveedor = {
    razonSocial: "",
    ruc: "",
    desProd: "",
    nombres: "",
    apellidos: "",
    cargoRes: "",
    nroDoc: "",
    tipoDoc: {
      idTipoDoc: -1
    }
  }
  objUsuario: Usuario = {};

  constructor(
    private utilService: UtilService,
    private tokenService: TokenService,
    private externoService: ProveedorService,
    private formBuilder: FormBuilder,
  ) {
    utilService.listaTipoDocumento().subscribe(
      x => this.lstTipoDoc = x
    );

    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }
}
