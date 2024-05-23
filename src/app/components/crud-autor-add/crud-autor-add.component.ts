import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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


@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-crud-autor-add',
  templateUrl: './crud-autor-add.component.html',
  styleUrls: ['./crud-autor-add.component.css']
})

export class CrudAutorAddComponent {

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
  
  objUsuario: Usuario = {} ;

  //PARA LAS VALIDACIONES
  formsRegistra = this.formBuilder.group({ 
    validaNombres: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{4,40}')]] ,
    validaApellidos: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{4,40}')]] ,  
    validaFechaNacimiento: ['', [Validators.required] ] , 
    validaTelefono: ['', [Validators.required, Validators.pattern('018[0-9]{6}')]], 
    validaCelular: ['', [Validators.required, Validators.pattern('9[0-9]{8}')] ] ,  
    validaOrcid: ['', [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}')] ],
    validaPais: ['', Validators.min(1)] , 
    validaGrado: ['', Validators.min(1)] , 
  });

  constructor(private autorService:AutorService , private utilService: UtilService, private tokenService: TokenService,
              private formBuilder: FormBuilder
  ) {
        utilService.listaPais().subscribe(
          x   =>   this.lstPais=x
        )

        utilService.listaGradoAutor().subscribe(
          x   =>   this.lstGrado=x
        )

        this.objUsuario.idUsuario = tokenService.getUserId();
  }

registra(){
  if (this.formsRegistra.valid){

    this.autor.usuarioActualiza = this.objUsuario;
    this.autor.usuarioRegistro = this.objUsuario;
  
    
    this.autorService.registrar(this.autor).subscribe(
      x => {
        Swal.fire({
          icon: 'info',
          title: 'Resultado del Registro',
          text: x.mensaje,
        })
      },
    );
    // Reiniciar el formulario
    this.formsRegistra.reset();
    }
    //borra los errores
    Object.keys(this.formsRegistra.controls).forEach(x => {
      this.formsRegistra.get(x)?.setErrors(null);
});
  }
  }
