import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Libro } from '../../models/libro.model';
import { Editorial } from '../../models/editorial.model';
import { Usuario } from '../../models/usuario.model';
import { LibroService } from '../../services/libro.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog'; 
import { CrudLibroAddComponent } from '../crud-libro-add/crud-libro-add.component';

@Component({
  selector: 'app-agregar-libro',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-libro.component.html',
  styleUrls: ['./agregar-libro.component.css']
})
export class AgregarLibroComponent  {
  lstEstadoPrestamo: DataCatalogo[] = [];
  lstCategoria: DataCatalogo[] = [];
  lstTipoLibro: DataCatalogo[] = [];
  lstEditorial: Editorial[] = [];

  libro: Libro = {
    titulo: "",
    anio: 0,
    serie: "",
    editorial: {
      idEditorial: -1
    },
    categoriaLibro: {
      idDataCatalogo: -1
    },
    estadoPrestamo: {
      idDataCatalogo: -1
    },
    tipoLibro: {
      idDataCatalogo: -1
    }
  };

  objUsuario: Usuario = {};

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
  
  
  constructor(
    private libroService: LibroService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CrudLibroAddComponent>, 
  ) {
    utilService.listaEditorial().subscribe(
      x => (this.lstEditorial = x)
    );
    utilService.listaCategoriaDeLibro().subscribe(
      x => (this.lstCategoria = x)
    );
    utilService.listaTipoLibroRevista().subscribe(
      x => (this.lstTipoLibro = x)
    );
    utilService.listaEstadoLibro().subscribe(
      x => (this.lstEstadoPrestamo = x)
    );
    this.objUsuario.idUsuario = tokenService.getUserId();
  }
  libroExistente: boolean = false;
  registra() {
    if (this.formsRegistra.valid) {
      this.libro.usuarioActualiza = this.objUsuario;
      this.libro.usuarioRegistro = this.objUsuario;

      this.libroService.registrarCrud(this.libro).subscribe(
        x => {
          Swal.fire({
            icon: 'info',
            title: 'Resultado del Registro',
            text: x.mensaje,
          });
        }
      );
    }
  }
}
