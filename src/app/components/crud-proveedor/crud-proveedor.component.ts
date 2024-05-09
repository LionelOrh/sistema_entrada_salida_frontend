import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { MatDialog } from '@angular/material/dialog';
import { CrudProveedorAddComponent } from '../crud-proveedor-add/crud-proveedor-add.component';
import { ProveedorService } from '../../services/proveedor.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from '../../models/proveedor.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrudProveedorUpdateComponent } from '../crud-proveedor-update/crud-proveedor-update.component';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-crud-proveedor',
  templateUrl: './crud-proveedor.component.html',
  styleUrls: ['./crud-proveedor.component.css']
})
export class CrudProveedorComponent {
 //Grila
 dataSource:any;

 //Clase para la paginacion
 @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

 //Cabecera
 displayedColumns = ["idProveedor","razonsocial","ruc","direccion","telefono","celular","contacto", "estado","pais","tipoProveedor", "acciones"];

 //filtro de la consulta
 filtro: string = "";

 objUsuario: Usuario = {} ;
 
 constructor(private dialogService: MatDialog, 
             private proveedorService: ProveedorService,
             private tokenService: TokenService ){
   this.objUsuario.idUsuario = tokenService.getUserId();
 }

 openAddDialog(){
       console.log(">>> openAddDialog [ini]");
       const dialogo = this.dialogService.open(CrudProveedorAddComponent);
       dialogo.afterClosed().subscribe(
             x => {
                  console.log(">>> x >> "  +  x); 
                  if (x === 1){
                     this.refreshTable();
                  }
             }
       );
       console.log(">>> openAddDialog [fin]");
   }

 openUpdateDialog(obj:Proveedor){
     console.log(">>> openUpdateDialog [ini]");
     const dialogo = this.dialogService.open(CrudProveedorUpdateComponent, {data:obj});
     dialogo.afterClosed().subscribe(
           x => {
                console.log(">>> x >> "  +  x); 
                if (x === 1){
                   this.refreshTable();
                }
           }
     );
     console.log(">>> openUpdateDialog [fin]");
 }


 refreshTable(){
     console.log(">>> refreshTable [ini]");
     var msgFiltro = this.filtro == "" ? "todos":  this.filtro;
     this.proveedorService.consultarCrud(msgFiltro).subscribe(
           x => {
             this.dataSource = new MatTableDataSource<Proveedor>(x);
             this.dataSource.paginator = this.paginator
           }
     );

     console.log(">>> refreshTable [fin]");
 }


 actualizaEstado(obj : Proveedor){
   console.log(">>> actualizaEstado [ ini ]");

   obj.estado =  obj.estado == 1 ? 0 : 1;
   obj.usuarioActualiza =  this.objUsuario;
   this.proveedorService.actualizarCrud(obj).subscribe();

   console.log(">>> actualizaEstado [ fin ]");
 }

 elimina(obj:Proveedor){
   Swal.fire({
     title: '¿Desea eliminar?',
     text: "Los cambios no se van a revertir",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Sí, elimina',
     cancelButtonText: 'No, cancelar'
   }).then((result) => {
         if (result.isConfirmed) {
             this.proveedorService.eliminarCrud(obj.idProveedor || 0).subscribe(
                   x => {
                         this.refreshTable();
                         Swal.fire('Mensaje', x.mensaje, 'info');
                   }
             );
         }
   })   
}

}

