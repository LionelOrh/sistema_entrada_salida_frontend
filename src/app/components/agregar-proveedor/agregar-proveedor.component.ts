import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Usuario } from '../../models/usuario.model';
import { ProveedorService } from '../../services/proveedor.service';
import { TokenService } from '../../security/token.service';
import { Proveedor } from '../../models/proveedor.model';
import Swal from 'sweetalert2';
@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent,ReactiveFormsModule],
  selector: 'app-agregar-proveedor',
  templateUrl: './agregar-proveedor.component.html',
  styleUrls: ['./agregar-proveedor.component.css']
})
export class AgregarProveedorComponent {

  lstPais: Pais[] = [];
  lstTipo: DataCatalogo[] = []; 
  objProveedor: Proveedor ={
        razonsocial: "",
        ruc:"",
        direccion: "",
        telefono:"",
        celular:"",
        contacto:"",
        pais:{
          idPais:-1
        },
        tipoProveedor:{
          idDataCatalogo:-1
      }
    }
    objUsuario: Usuario = {} ;
    
    formsRegistra = this.FormBuilder.group({ 
      validarazonsocial: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,100}')]],
      validaruc: ['', [Validators.required, Validators.pattern('[0-9]{11}')]],
      validadireccion: ['', [Validators.required]],
      validatelefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
      validacelular: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
      validacontacto: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
      validapais: ['', Validators.min(1)] , 
      validatipoProveedor: ['', Validators.min(1)] ,
      });

  constructor(private utilService: UtilService, 
              private tokenService: TokenService,
              private ProveedorService: ProveedorService,
              private FormBuilder: FormBuilder){
                this.utilService.listaTipoProveedor().subscribe(
                  x =>  this.lstTipo = x
            );
          this.utilService.listaPais().subscribe(
            x =>  this.lstPais = x
          );
          this.objUsuario.idUsuario = tokenService.getUserId();
  }
  registrar(){
    if (this.formsRegistra.valid){
    this.objProveedor.usuarioActualiza=this.objUsuario;
    this.objProveedor.usuarioRegistro = this.objUsuario;

    this.ProveedorService.registrar(this.objProveedor).subscribe(
        x =>
          Swal.fire({
            icon: 'success',
            title: 'Resultado del Registro',
            text: x.mensaje,
          })
    );
    this.objProveedor = {
      razonsocial: "",
      ruc: "",
      direccion: "",
      telefono: "",
      celular: "",
      contacto: "",
      pais: { idPais: -1 },
      tipoProveedor: { idDataCatalogo: -1 }
    };
    this.formsRegistra.reset();
    
}
}
}

