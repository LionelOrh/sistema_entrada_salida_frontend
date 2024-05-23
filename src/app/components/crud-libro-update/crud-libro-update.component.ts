import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Editorial } from '../../models/editorial.model';
import { Libro } from '../../models/libro.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { LibroService } from '../../services/libro.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppMaterialModule } from '../../app.material.module';
import { CrudLibroAddComponent } from '../crud-libro-add/crud-libro-add.component';

@Component({  
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-libro-update',
  templateUrl: './crud-libro-update.component.html',
  styleUrls: ['./crud-libro-update.component.css']
})
export class CrudLibroUpdateComponent {
  // Definición del validador personalizado
  yearValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const currentYear = new Date().getFullYear();
    if (value && (value < 1800 || value > currentYear)) {
      return { yearInvalid: true };
    }
    return null;
  };

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

  formsActualizar = this.formBuilder.group({
    validatitulo: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ ]{3,50}$')]],
    validaserie: ['', [Validators.required, Validators.pattern('^[A-Z]{3}[0-9]{7}$')]],
    validaanio: ['', [Validators.required, this.yearValidator]], // Aplicar el validador personalizado aquí
    validaCategoriaLibro: ['', Validators.min(1)],
    validaEstadoPrestamo: ['', Validators.min(1)],
    validaTipoLibro: ['', Validators.min(1)],
    validaEditorial: ['', Validators.min(1)],
  });

  constructor(
    private utilService: UtilService,
    private tokenService: TokenService,
    private libroService: LibroService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CrudLibroAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.libro = data;

    console.log(">>>> [ini] >>> libro");
    console.log(this.libro);

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

  actualizar() {
    if (this.formsActualizar.valid) {
      this.libro.usuarioActualiza = this.objUsuario;
      this.libro.usuarioRegistro = this.objUsuario;
      this.libroService.actualizarCrud(this.libro).subscribe(
        x => {
          if (x.mensaje === "El libro " + this.libro.titulo + " ya existe") {
            this.libroExistente = true;
            this.formsActualizar.controls.validatitulo.setErrors({'libroExistente': true});
          } else {
            this.libroExistente = false;
            Swal.fire({
              icon: 'success',
              title: 'Resultado del Registro',
              text: x.mensaje,
            });
        this.dialogRef.close(); // Cierra la ventana de registro
          }
    }
  );
}
  }
}