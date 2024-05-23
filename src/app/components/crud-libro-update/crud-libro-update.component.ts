import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({  
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-libro-update',
  templateUrl: './crud-libro-update.component.html',
  styleUrls: ['./crud-libro-update.component.css']
})


  

export class CrudLibroUpdateComponent {
 
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
    validaanio: ['', [Validators.required, Validators.pattern('^(18[0-9]{2}|19[0-9]{2}|20[0-2][0-4])$')]],
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
  actualizar() {
    if (this.formsActualizar.valid) {
      this.libro.usuarioActualiza = this.objUsuario;
      this.libro.usuarioRegistro = this.objUsuario;

      this.libroService.actualizarCrud(this.libro).subscribe((x) => {
        Swal.fire({
          icon: 'info',
          title: 'Resultado de la Actualización',
          text: x.mensaje,
        });
      });
    }
  }

}

