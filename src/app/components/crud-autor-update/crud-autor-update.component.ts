import { Component, Inject, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { Autor } from '../../models/autor.model';
import { Usuario } from '../../models/usuario.model';
import { AutorService } from '../../services/autor.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-autor-update',
  templateUrl: './crud-autor-update.component.html',
  styleUrls: ['./crud-autor-update.component.css']
})

export class CrudAutorUpdateComponent {

  lstPais: Pais[] = [];
  lstGrado: DataCatalogo[] = [];
  autor: Autor = {
    nombres: "",
    apellidos: "",
    fechaNacimiento: new Date,
    telefono: "",
    celular: "",
    orcid: "",
    pais: {
      idPais: -1
    },
    grado: {
      idDataCatalogo: -1
    }
  };

  objUsuario: Usuario = {};

  //PARA LAS VALIDACIONES
  formsActualizar = this.formBuilder.group({
    validaNombres: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaApellidos: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
    validaFechaNacimiento: ['', [Validators.required]],
    validaTelefono: ['', [Validators.required, Validators.pattern('01[0-9]{7}')]],
    validaCelular: ['', [Validators.required, Validators.pattern('9[0-9]{8}')]],
    validaOrcid: ['', [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}')]],
    validaPais: ['', Validators.min(1)],
    validaGrado: ['', Validators.min(1)],
  });


  constructor(private autorService: AutorService, private utilService: UtilService, private tokenService: TokenService,
    private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.autor = data;
    

    console.log(">>>> [ini] >>> autor");
    console.log(this.autor);

    utilService.listaPais().subscribe(
      x => this.lstPais = x
    )

    utilService.listaGradoAutor().subscribe(
      x => this.lstGrado = x
    )

    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  actualizar() {
    if (this.formsActualizar.valid) {
      this.autor.usuarioActualiza = this.objUsuario;
      this.autor.usuarioRegistro = this.objUsuario;

      this.autorService.actualizarCrud(this.autor).subscribe((x) => {
        Swal.fire({
          icon: 'info',
          title: 'Resultado de la Actualización',
          text: x.mensaje,
        });
      });
    }
  }

}
