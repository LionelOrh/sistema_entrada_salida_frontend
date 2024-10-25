import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { TipoDocumento } from '../../models/tipoDocumento.model';
import { Proveedor } from '../../models/proveedor.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { ProveedorService } from '../../services/proveedor.service';
import Swal from 'sweetalert2';
import JsBarcode from 'jsbarcode';

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
    tipoDocumento: { idTipoDoc: -1 }
  };
  objUsuario: Usuario = {};
  formRegistra: FormGroup;
  codigoBarrasGenerado: boolean = false; 

  constructor(
    private utilService: UtilService,
    private tokenService: TokenService,
    private proveedorService: ProveedorService,
    private formBuilder: FormBuilder
  ) {
    this.utilService.listaTipoDocumento().subscribe(x => this.lstTipoDoc = x);
    this.objUsuario.idUsuario = this.tokenService.getUserId();

    this.formRegistra = this.formBuilder.group({
      validaRazonSocial: ['', [Validators.required]],
      validaRuc: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]], 
      validaDesProd: ['', [Validators.required]],
      validaNombres: ['', [Validators.required]],
      validaApellidos: ['', [Validators.required]],
      validaCargoRes: ['', [Validators.required]],
      validaTipoDocumento: [-1, [Validators.required, this.tipoDocumentoValidator()]], 
      validaNroDoc: ['', [Validators.required, Validators.maxLength(45)]],
    });
  }

 
  tipoDocumentoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value === -1 ? { invalidTipoDocumento: true } : null;
    };
  }

  
  registrar() {
    if (this.formRegistra.invalid) {
      const errores = this.getErrorMessages();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incorrecto',
        html: `<ul>${errores}</ul>`,
        confirmButtonText: 'Cerrar'
      });
      return;
    }

 this.proveedor.usuarioActualiza = this.objUsuario;
 this.proveedor.usuarioRegistro = this.objUsuario;
 this.proveedor.razonSocial = this.formRegistra.value.validaRazonSocial;
 this.proveedor.ruc = this.formRegistra.value.validaRuc;
 this.proveedor.desProd = this.formRegistra.value.validaDesProd;
 this.proveedor.nombres = this.formRegistra.value.validaNombres;
 this.proveedor.apellidos = this.formRegistra.value.validaApellidos;
 this.proveedor.cargoRes = this.formRegistra.value.validaCargoRes;
 this.proveedor.nroDoc = this.formRegistra.value.validaNroDoc;
 this.proveedor.tipoDocumento = { idTipoDoc: this.formRegistra.value.validaTipoDocumento };

 
 this.proveedorService.registrar(this.proveedor).subscribe(
  response => {
    const idProveedor = response.id;      
    const nroDocProveedor = response.nroDoc; 


    const idDniCombo = `${idProveedor}${nroDocProveedor}`;


    const cifrado = btoa(idDniCombo);  

 
    this.generarCodigoBarras(cifrado); 
    this.codigoBarrasGenerado = true; 

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: response.mensaje,
      confirmButtonText: 'Cerrar'
    });
  },
  error => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al realizar el registro. Inténtalo de nuevo.',
      confirmButtonText: 'Cerrar'
    });
  }
);
}

generarCodigoBarras(cifrado: string) {
setTimeout(() => {
  const barcodeElement = document.getElementById('barcode');
  if (barcodeElement) {
    JsBarcode(barcodeElement, cifrado, { 
      format: 'CODE128',
      lineColor: '#0aa',
      width: 2,
      height: 40,
      displayValue: true
    });
  } else {
    console.error("No se encontró el elemento de código de barras");
  }
}, 100);
}

 
  getErrorMessages(): string {
    const errores = [];
    const controls = this.formRegistra.controls;

    if (controls['validaRazonSocial'].hasError('required')) {
      errores.push('<li>La razón social es obligatoria.</li>');
    }

    if (controls['validaRuc'].hasError('required')) {
      errores.push('<li>El RUC es obligatorio.</li>');
    } else if (controls['validaRuc'].hasError('pattern')) {
      errores.push('<li>El RUC debe tener 11 dígitos.</li>');
    }

    if (controls['validaNombres'].hasError('required')) {
      errores.push('<li>El nombre es obligatorio.</li>');
    }

    if (controls['validaApellidos'].hasError('required')) {
      errores.push('<li>El apellido es obligatorio.</li>');
    }

    if (controls['validaCargoRes'].hasError('required')) {
      errores.push('<li>El cargo del responsable es obligatorio.</li>');
    }

    if (controls['validaNroDoc'].hasError('required')) {
      errores.push('<li>El número de documento es obligatorio.</li>');
    } else if (controls['validaNroDoc'].hasError('maxlength')) {
      errores.push('<li>El número de documento no debe exceder los 8 caracteres.</li>');
    }

    return errores.join('');
  }
}
