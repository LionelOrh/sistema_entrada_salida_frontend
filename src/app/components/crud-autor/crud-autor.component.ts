import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from '../../security/token.service';
import { AutorService } from '../../services/autor.service';
import { CrudAutorAddComponent } from '../crud-autor-add/crud-autor-add.component';
import { Autor } from '../../models/autor.model';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CrudAutorUpdateComponent } from '../crud-autor-update/crud-autor-update.component';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-crud-autor',
  templateUrl: './crud-autor.component.html',
  styleUrls: ['./crud-autor.component.css']
})
export class CrudAutorComponent {

  //Grila
  dataSource: any;

  //Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idAutor", "nombres", "apellidos", "fechaNacimiento", "telefono","celular", "orcid", "pais", "grado","estado", "acciones"];

  //filtro de la consulta
  filtro: string = "";

  objUsuario: Usuario = {};


  constructor(private dialogService: MatDialog,
    private autorService: AutorService,
    private tokenservice: TokenService
  ) {
    this.objUsuario.idUsuario = tokenservice.getUserId();
  }

  openDialog() {
    console.log(">>> openDialog  [ini]");
    const dialog = this.dialogService.open(CrudAutorAddComponent);
    dialog.afterClosed().subscribe(
      x => {
        console.log(">>> x >> " + x);
        if (x == 1) {
          this.refreshTable();
        }
      }
    );

    console.log(">>> openDialog  [fin]");
  }

  refreshTable() {
    console.log(">>> refreshTable [ini]");
    var msgFiltro = this.filtro == "" ? "todos" : this.filtro;
    this.autorService.consultarCrud(msgFiltro).subscribe(
      x => {
        this.dataSource = new MatTableDataSource<Autor>(x);
        this.dataSource.paginator = this.paginator
      }
    );

    console.log(">>> refreshTable [fin]");
  }
  actualizaEstado(obj: Autor) {
    console.log(">>> actualizaEstado [ ini ]");

    obj.estado = obj.estado == 1 ? 0 : 1;
    obj.usuarioActualiza = this.objUsuario;
    this.autorService.actualizarCrud(obj).subscribe();

    console.log(">>> actualizaEstado [ fin ]");
  }

  elimina(obj: Autor) {
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
        this.autorService.eliminarCrud(obj.idAutor || 0).subscribe(
          x => {
            this.refreshTable();
            Swal.fire('Mensaje', x.mensaje, 'info');
          }
        );
      }
    })
  }

  openUpdateDialog(obj: Autor) {
    console.log(">>> openUpdateDialog [ini]");
    const dialogo = this.dialogService.open(CrudAutorUpdateComponent, { data: obj });
    dialogo.afterClosed().subscribe(
      x => {
        console.log(">>> x >> " + x);
        if (x === 1) {
          this.refreshTable();
        }
      }
    );
    console.log(">>> openUpdateDialog [fin]");
  }
}
