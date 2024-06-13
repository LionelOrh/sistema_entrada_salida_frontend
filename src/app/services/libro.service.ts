import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Libro } from '../models/libro.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

const baseUrlLibro = AppSettings.API_ENDPOINT+ '/libro';
const baseUrlCrudLibro = AppSettings.API_ENDPOINT+ '/crudLibro';
const baseUrlConsultaLibro = AppSettings.API_ENDPOINT+ '/consultaLibro';


@Injectable({
  providedIn: 'root'
})
export class LibroService {

  constructor(private http:HttpClient) { }

  registrar(data:Libro):Observable<any>{
    return this.http.post(baseUrlLibro, data);
  }

  //PC2 - CRUD
  registrarCrud(data:Libro):Observable<any>{
    return this.http.post(baseUrlCrudLibro+"/registraLibro", data);
  }
  actualizarCrud(data:Libro):Observable<any>{
    return this.http.put(baseUrlCrudLibro+"/actualizaLibro", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudLibro+"/eliminaLibro/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudLibro+"/listaLibroPorTituloLike/"+ filtro);
  }




  ConsultaLibroComplejo(
    titulo: string,
    anio: number,
    serie: string,
    estado: number,
    idCategoriaLibro: number,
    idEstadoPrestamo: number,
    idTipoLibro: number,
    idEditorial: number
  ): Observable<any> {
    const params = new HttpParams()
      .set("titulo", titulo)
      .set("anio", anio)
      .set("serie", serie)
      .set("estado", estado)
      .set("idCategoriaLibro", idCategoriaLibro)
      .set("idEstadoPrestamo", idEstadoPrestamo)
      .set("idTipoLibro", idTipoLibro)
      .set("idEditorial", idEditorial)


    return this.http.get(baseUrlConsultaLibro + "/consultaLibroPorParametros", { params })
  }


}
