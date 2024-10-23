import { Component, OnInit, ViewChild } from '@angular/core';
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
    tipoDocumento: {idTipoDoc: -1 }
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

    
    this.formRegistra = this.formBuilder.group({
      validaNombre: ['', Validators.required],
      validaApellido: ['', Validators.required],
      validaCelular: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]], // Ajusta el patrón según sea necesario
      validaTipoDocumento: [-1, [Validators.required, this.tipoDocumentoValidator()]],  // Validador personalizado
      validaNumeroDocumento: ['', Validators.required],
      validaCorreo: ['', [Validators.required, Validators.email]],
      validaMotivo: ['', Validators.required]
    });
  }

  tipoDocumentoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value === -1 ? { invalidTipoDocumento: true } : null;
    };
  }
  
  registra() {
    if (this.formRegistra.valid) {
      this.externo.usuarioRegistro = this.objUsuario;
      // Asignar los valores del formulario a la entidad externo
      this.externo.nombres = this.formRegistra.value.validaNombre;
      this.externo.apellidos = this.formRegistra.value.validaApellido;
      this.externo.celular = this.formRegistra.value.validaCelular;
      this.externo.correo = this.formRegistra.value.validaCorreo;
      this.externo.num_doc = this.formRegistra.value.validaNumeroDocumento;
      this.externo.motivo = this.formRegistra.value.validaMotivo;
  
      // Asegúrate de que el tipoDoc esté correctamente inicializado
      this.externo.tipoDocumento = { idTipoDoc: this.formRegistra.value.validaTipoDocumento };  // Inicializar aquí
  
      // Log para verificar el valor asignado
      console.log('Objeto externo:', this.externo);
  
      // Enviar el objeto externo al servicio para que se registre
      this.externoService.registrar(this.externo).subscribe(
        response => {
          console.log('Registro exitoso', response);
          // Aquí puedes manejar la respuesta de éxito
        },
        error => {
          console.error('Error en el registro', error);
          // Aquí puedes manejar el error
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

}