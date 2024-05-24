import { Component, Inject, OnInit } from '@angular/core';
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
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

function rucUnique(ProveedorService: ProveedorService, originalRuc: string) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value === originalRuc) {
      return of(null);
    }
    return ProveedorService.validaRucActualiza(control.value).pipe(
      debounceTime(500),
      map(response => (response.valid ? null : { rucNotUnique: true })),
      catchError(() => of(null))
    );
  };
}

function razonSocialUnique(ProveedorService: ProveedorService, originalRazonSocial: string) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value === originalRazonSocial) {
      return of(null);
    }
    return ProveedorService.validaRazonSocial(control.value).pipe(
      debounceTime(500),
      map(response => (response.valid ? null : { razonSocialNotUnique: true })),
      catchError(() => of(null))
    );
  };
}

function celularUnique(ProveedorService: ProveedorService, originalCelular: string) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value === originalCelular) {
      return of(null);
    }
    return ProveedorService.validaCelular(control.value).pipe(
      debounceTime(500),
      map(response => (response.valid ? null : { celularNotUnique: true })),
      catchError(() => of(null))
    );
  };
}

function contactoUnique(ProveedorService: ProveedorService, originalContacto: string) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value === originalContacto) {
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
  selector: 'app-crud-proveedor-update',
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-proveedor-update.component.html',
  styleUrls: ['./crud-proveedor-update.component.css'],
  providers: [provideNativeDateAdapter()],
})
export class CrudProveedorUpdateComponent {

  lstPais: Pais[] = [];
  lstTipo: DataCatalogo[] = [];
  originalRuc: string;
  originalRazonSocial: string;
  originalCelular: string;
  originalContacto: string;

  formsActualiza = this.formBuilder.group({
    validarazonsocial: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{4,40}')], [this.razonSocialUniqueValidator.bind(this)]],
    validaruc: ['', [Validators.required, Validators.pattern('[0-9]{11}'), ruc10], [this.rucUniqueValidator.bind(this)]],
    validadireccion: ['', [Validators.required, Validators.pattern('^.{4,40}$')]],
    validatelefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    validacelular: ['', [Validators.required, Validators.pattern('^[0-9]{9}$'), cel8], [this.celularUniqueValidator.bind(this)]],
    validacontacto: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ ]{4,40}$')], [this.contactoUniqueValidator.bind(this)]],
    validapais: ['', [Validators.min(1)]],
    validatipoProveedor: ['', [Validators.min(1)]],
  });

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
  objUsuario: Usuario = {}

  constructor(private utilService: UtilService,
    private tokenService: TokenService,
    private proveedorService: ProveedorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {
    data.fechaCreacion = new Date(new Date(data.fechaCreacion).getTime() + (1000 * 60 * 60 * 24));
    this.objProveedor = data;

    console.log(">>>> [ini] >>> objProveedor");
    console.log(this.objProveedor);
    this.utilService.listaTipoProveedor().subscribe(
      x => this.lstTipo = x
    );
    this.utilService.listaPais().subscribe(
      x => this.lstPais = x
    );
    this.objUsuario.idUsuario = tokenService.getUserId();
    this.objProveedor = this.data;
    this.originalRuc = this.data.ruc;
    this.originalRazonSocial = this.data.razonsocial;
    this.originalContacto = this.data.contacto;
    this.originalCelular = this.data.celular;
  }
  rucUniqueValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return rucUnique(this.proveedorService, this.originalRuc)(control);
  }

  razonSocialUniqueValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return razonSocialUnique(this.proveedorService, this.originalRazonSocial)(control);
  }

  celularUniqueValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return celularUnique(this.proveedorService, this.originalCelular)(control);
  }
  contactoUniqueValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return contactoUnique(this.proveedorService, this.originalContacto)(control);
  }

  actualizar() {
    this.objProveedor.usuarioActualiza = this.objUsuario;
    this.objProveedor.usuarioRegistro = this.objUsuario;
    this.proveedorService.actualizarCrud(this.objProveedor).subscribe((x) => {
      Swal.fire({
        icon: 'info',
        title: 'Resultado del Registro',
        text: x.mensaje,
      });
    });
  }
}
