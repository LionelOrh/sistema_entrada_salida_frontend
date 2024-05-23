import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Libro } from '../../models/libro.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { LibroService } from '../../services/libro.service';
import Swal from 'sweetalert2';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Editorial } from '../../models/editorial.model';


@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-agregar-libro',
  templateUrl: './agregar-libro.component.html',
  styleUrls: ['./agregar-libro.component.css']
})
export class AgregarLibroComponent {
  // Definición del validador personalizado
  yearValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const currentYear = new Date().getFullYear();
    if (value && (value < 1800 || value > currentYear)) {
      return { yearInvalid: true };
    }
    return null;
  };

  formsRegistra = this.formBuilder.group({
    validatitulo: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ ]{3,50}$')]],
    validaserie: ['', [Validators.required, Validators.pattern('^[A-Z]{3}[0-9]{7}$')]],
    validaanio: ['', [Validators.required, this.yearValidator]], // Aplicar el validador personalizado aquí
    validaCategoriaLibro: ['', Validators.min(1)],
    validaEstadoPrestamo: ['', Validators.min(1)],
    validaTipoLibro: ['', Validators.min(1)],
    validaEditorial: ['', Validators.min(1)],
  });

  lstTipo: DataCatalogo[] = [];
  lstCategoria: DataCatalogo[] = [];
  lstEstado: DataCatalogo[] = [];
  lstEditorial: Editorial[] = [];

  libro: Libro = {
    titulo: "",
    anio: 0,
    serie: "",
    categoriaLibro: {
      idDataCatalogo: -1
    },
    estadoPrestamo: {
      idDataCatalogo: -1
    },
    tipoLibro: {
      idDataCatalogo: -1
    },
    editorial: {
      idEditorial: -1
    },
  };

  objUsuario: Usuario = {};

  constructor(
    private utilService: UtilService,
    private tokenService: TokenService,
    private libroService: LibroService,
    private formBuilder: FormBuilder,
  ) {
    utilService.listaCategoriaDeLibro().subscribe(
      x => this.lstCategoria = x
    );
    utilService.listaTipoLibroRevista().subscribe(
      x => this.lstTipo = x
    );
    utilService.listaEditorial().subscribe(
      x => this.lstEditorial = x
    );
    utilService.listaEstadoLibro().subscribe(
      x => this.lstEstado = x
    );

    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }


  libroExistente: boolean = false;

  registra() {
    if (this.formsRegistra.valid) {
      this.libro.usuarioActualiza = this.objUsuario;
      this.libro.usuarioRegistro = this.objUsuario;
      this.libroService.registrarCrud(this.libro).subscribe(
        x => {
          if (x.mensaje === "El libro " + this.libro.titulo + " ya existe") {
            this.libroExistente = true;
            this.formsRegistra.controls.validatitulo.setErrors({ 'libroExistente': true });
          } else {
            this.libroExistente = false;
            Swal.fire({
              icon: 'success',
              title: 'Resultado del Registro',
              text: x.mensaje,
            });
            this.formsRegistra.reset();
            // Borra los errores
            Object.keys(this.formsRegistra.controls).forEach(controlName => {
              this.formsRegistra.get(controlName)?.setErrors(null);
            });
            // Recarga la página
            window.location.reload();
          }
        });
    }
  }
}