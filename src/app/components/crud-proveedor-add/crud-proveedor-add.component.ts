import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Proveedor } from '../../models/proveedor.model';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { ProveedorService } from '../../services/proveedor.service';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

function ruc10(control: AbstractControl): ValidationErrors | null {
  const ruc = control.value;
  if (ruc && !ruc.startsWith('10')) {
    return { ruc10: true };
  }
  return null;
}
function cel8(control: AbstractControl): ValidationErrors | null {
  const celular = control.value;
  if (celular && !celular.startsWith('8')) {
    return { cel8: true };
  }
  return null;
}
// Validador  para verificar si el RUC es único
function rucUnique(ProveedorService: ProveedorService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return ProveedorService.validaRucActualiza(control.value).pipe(
      debounceTime(500),
      map(response => (response.valid ? null : { rucNotUnique: true })),
      catchError(() => of(null))
    );
  };
}
// Validador  para verificar si la razon social es única
function razonSocialUnique(ProveedorService: ProveedorService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return ProveedorService.validaRazonSocial(control.value).pipe(
      debounceTime(500),
      map(response => (response.valid ? null : { razonSocialNotUnique: true })),
      catchError(() => of(null))
    );
  };
}
// Validador  para verificar si el celular es único
function celularUnique(ProveedorService: ProveedorService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return ProveedorService.validaCelular(control.value).pipe(
      debounceTime(500),
      map(response => (response.valid ? null : { celularNotUnique: true })),
      catchError(() => of(null))
    );
  };
}
// Validador  para verificar si el contacto es único
function contactoUnique(ProveedorService: ProveedorService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return ProveedorService.validaContacto(control.value).pipe(
      debounceTime(500),
      map(response => (response.valid ? null : { contactoNotUnique: true })),
      catchError(() => of(null))
    );
  };
}
@Component({
  standalone: true,
  selector: 'app-crud-proveedor-add',
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-proveedor-add.component.html',
  styleUrls: ['./crud-proveedor-add.component.css']
})
export class CrudProveedorAddComponent {
  lstPais: Pais[] = [];
  lstTipo: DataCatalogo[] = [];
  objProveedor: Proveedor = {
    razonsocial: "",
    ruc: "",
    direccion: "",
    telefono: "",
    celular: "",
    contacto: "",
    pais: {
      idPais: -1
    },
    tipoProveedor: {
      idDataCatalogo: -1
    }
  }
  objUsuario: Usuario = {};
  formsRegistra = this.FormBuilder.group({
    validarazonsocial: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ ]{4,40}$')], [razonSocialUnique(this.proveedorService)]],
    validaruc: ['', [Validators.required, Validators.pattern('[0-9]{11}'), ruc10], [rucUnique(this.proveedorService)]],
    validadireccion: ['', [Validators.required, Validators.pattern('^.{4,40}$')]],
    validatelefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    validacelular: ['', [Validators.required, Validators.pattern('^[0-9]{9}$'),cel8], [celularUnique(this.proveedorService)]],    
    validacontacto: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ ]{4,40}$')], [contactoUnique(this.proveedorService)]],
    validapais: ['', [Validators.min(1)]],
    validatipoProveedor: ['', [Validators.min(1)]],

  });

  constructor(private utilService: UtilService,
    private tokenService: TokenService,
    private proveedorService: ProveedorService,
    private FormBuilder: FormBuilder) {
    this.utilService.listaTipoProveedor().subscribe(
      x => this.lstTipo = x
    );
    this.utilService.listaPais().subscribe(
      x => this.lstPais = x
    );
    this.objUsuario.idUsuario = tokenService.getUserId();
  }
  registra() {
    this.objProveedor.usuarioActualiza = this.objUsuario;
    this.objProveedor.usuarioRegistro = this.objUsuario;
    this.proveedorService.registrarCrud(this.objProveedor).subscribe(
      x => {
        Swal.fire({
          icon: 'info',
          title: 'Resultado del Registro',
          text: x.mensaje,
        })
      },
    );
  }
}
