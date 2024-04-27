import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

  formsRegistra = this.formBuilder.group({
    validaTitulo: ['', [Validators.required, Validators.minLength(3)]],
    validaAnio: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
    validaSerie: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?]{9}')]],
    validaEditorial: ['', Validators.min(1)],
    validaCategoriaLibro: ['', Validators.min(1)],
    validaEstadoPrestamo: ['', Validators.min(1)],
    validaTipoLibro: ['', Validators.min(1)],
  });
  
  constructor(
    private libroService: LibroService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder
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

  registra(){
    if (this.formsRegistra.valid){
      this.libro.usuarioActualiza = this.objUsuario;
      this.libro.usuarioRegistro = this.objUsuario;
  
      this.libroService.registrar(this.libro).subscribe(
        x => 
          Swal.fire({
            icon: 'success',
            title: 'Resultado del Registro',
            text: x.mensaje,
          })
      );
           
          this.libro ={
   titulo: "",
    anio: 0,
    serie: "",
    editorial: {idEditorial: -1},
    categoriaLibro: {idDataCatalogo: -1},
    estadoPrestamo: {idDataCatalogo: -1},
    tipoLibro: {idDataCatalogo: -1 }
         
          };
          this.formsRegistra.reset();
    }
  }
}