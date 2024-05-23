import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selector: 'app-crud-libro-add',
  templateUrl: './crud-libro-add.component.html',
  styleUrls: ['./crud-libro-add.component.css']
})

export class CrudLibroAddComponent {
  formsRegistra = this.formBuilder.group({
    validatitulo: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ ]{3,50}$')]],
    validaserie: ['', [Validators.required, Validators.pattern('^[A-Z]{3}[0-9]{7}$')]],
    validaanio: ['', [Validators.required, Validators.pattern('^(18[0-9]{2}|19[0-9]{2}|20[0-2][0-4])$')]],
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
    private formBuilder: FormBuilder
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

          // Limpia el formulario
          this.formsRegistra.reset();

          // Borra los errores
          Object.keys(this.formsRegistra.controls).forEach(x => {
            this.formsRegistra.get(x)?.setErrors(null);
          });
        },
      );
    }
  }
}
