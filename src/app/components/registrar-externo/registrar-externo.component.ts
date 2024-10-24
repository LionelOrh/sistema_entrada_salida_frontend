import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { TipoDocumento } from '../../models/tipoDocumento.model';
import { UtilService } from '../../services/util.service';
import { ExternoService } from '../../services/externo.service';
import { TokenService } from '../../security/token.service';
import { Externo } from '../../models/externo.model';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],

  selector: 'app-registrar-externo',
  templateUrl: './registrar-externo.component.html',
  styleUrls: ['./registrar-externo.component.css']
})
export class RegistrarExternoComponent {
  lstTipoDoc: TipoDocumento[] = [];

  externo: Externo = {
    nombres: "",
    apellidos: "",
    celular: "",
    correo: "",
    num_doc: "",
    motivo: "",
    tipoDocumento: { idTipoDoc: -1 }
  }
  objUsuario: Usuario = {};
  formRegistra: FormGroup;

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

    // Definimos los validadores para cada campo
    this.formRegistra = this.formBuilder.group({
      validaNombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],  // Solo letras
      validaApellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],  // Solo letras
      validaCelular: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],  // 9 dígitos
      validaTipoDocumento: [-1, [Validators.required, this.tipoDocumentoValidator()]],  // Validador personalizado
      validaNumeroDocumento: ['', [Validators.required, Validators.maxLength(45)]],  // Máximo 45 caracteres
      validaCorreo: ['', [Validators.required, Validators.email]],  // Email válido
      validaMotivo: ['', [Validators.required, Validators.maxLength(100)]]  // Máximo 100 caracteres
    });
  }

  // Validador personalizado para tipo de documento
  tipoDocumentoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value === -1 ? { invalidTipoDocumento: true } : null;
    };
  }

  // Método para registrar el Externo
  registra() {
    // Si el formulario no es válido, mostrar los errores
    if (this.formRegistra.invalid) {
      const errores = this.getErrorMessages();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incorrecto',
        html: `<ul>${errores}</ul>`,  // Muestra la lista de errores en HTML
        confirmButtonText: 'Cerrar'
      });
      return;
    }

    // Si es válido, asignamos los valores y procedemos con la llamada al servicio
    this.externo.usuarioRegistro = this.objUsuario;
    this.externo.nombres = this.formRegistra.value.validaNombre;
    this.externo.apellidos = this.formRegistra.value.validaApellido;
    this.externo.celular = this.formRegistra.value.validaCelular;
    this.externo.correo = this.formRegistra.value.validaCorreo;
    this.externo.num_doc = this.formRegistra.value.validaNumeroDocumento;
    this.externo.motivo = this.formRegistra.value.validaMotivo;
    this.externo.tipoDocumento = { idTipoDoc: this.formRegistra.value.validaTipoDocumento };

    // Llamada al servicio para registrar el Externo
    this.externoService.registrar(this.externo).subscribe(
      response => {
        if (response.mensaje.includes('ya existe')) {
          Swal.fire({
            icon: 'warning',
            title: 'DNI ya registrado',
            text: `El número ${this.externo.num_doc} ya existe en la base de datos.`,
            confirmButtonText: 'Cerrar'
          });
        } else if (response.mensaje.includes('exitoso')) {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'El registro se completó correctamente.',
            confirmButtonText: 'Cerrar'
          });
        }
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

  // Método para generar mensajes de error
  getErrorMessages(): string {
    const errores = [];
    const controls = this.formRegistra.controls;

    if (controls['validaNombre'].hasError('required')) {
      errores.push('<li>El nombre es obligatorio.</li>');
    } else if (controls['validaNombre'].hasError('pattern')) {
      errores.push('<li>El nombre solo debe contener letras.</li>');
    }

    if (controls['validaApellido'].hasError('required')) {
      errores.push('<li>El apellido es obligatorio.</li>');
    } else if (controls['validaApellido'].hasError('pattern')) {
      errores.push('<li>El apellido solo debe contener letras.</li>');
    }

    if (controls['validaCelular'].hasError('required')) {
      errores.push('<li>El celular es obligatorio.</li>');
    } else if (controls['validaCelular'].hasError('pattern')) {
      errores.push('<li>El celular debe tener 9 dígitos y solo contener números..</li>');
    }

      // Validación para el campo "Número de Documento (DNI)"
  if (controls['validaNumeroDocumento'].hasError('required')) {
    errores.push('<li>El número de documento es obligatorio.</li>');
  } else if (controls['validaNumeroDocumento'].hasError('minlength')) {
    errores.push('<li>El número de documento debe tener al menos 8 caracteres.</li>');
  } else if (controls['validaNumeroDocumento'].hasError('maxlength')) {
    errores.push('<li>El número de documento no debe exceder los 45 caracteres.</li>');
  }

    if (controls['validaCorreo'].hasError('required')) {
      errores.push('<li>El correo es obligatorio.</li>');
    } else if (controls['validaCorreo'].hasError('email')) {
      errores.push('<li>El formato del correo es incorrecto.</li>');
    }

    if (controls['validaMotivo'].hasError('required')) {
      errores.push('<li>El motivo es obligatorio.</li>');
    } else if (controls['validaMotivo'].hasError('maxlength')) {
      errores.push('<li>El motivo no debe exceder los 100 caracteres.</li>');
    }

    return errores.join('');
  }
}
