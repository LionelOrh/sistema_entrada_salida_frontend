import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Libro } from '../models/libro.model';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
    anioDesde: number,
    anioHasta: number,
    serie: string,
    estado: number,
    idCategoriaLibro: number,
    idEstadoPrestamo: number,
    idTipoLibro: number,
    idEditorial: number
  ): Observable<any> {
    const params = new HttpParams()
      .set("titulo", titulo)
      .set("anioDesde", anioDesde)
      .set("anioHasta", anioHasta)
      .set("serie", serie)
      .set("estado", estado)
      .set("idCategoriaLibro", idCategoriaLibro)
      .set("idEstadoPrestamo", idEstadoPrestamo)
      .set("idTipoLibro", idTipoLibro)
      .set("idEditorial", idEditorial)


    return this.http.get(baseUrlConsultaLibro + "/consultaLibroPorParametros", { params })
  }



  generateDocumentReport(tit:string, desde:number,hasta:number, ser:string, est:number, idCate:number, idEs:number, idTip:number, idEdi:number): Observable<any> {
    const params = new HttpParams()
    .set("titulo", tit)
    .set("anioDesde", desde)
    .set("anioHasta", hasta)
    .set("serie", ser)
    .set("estado", est)
    .set("idCategoriaLibro", idCate)
    .set("idEstadoPrestamo", idEs)
    .set("idTipoLibro", idTip)
    .set("idEditorial", idEdi);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlConsultaLibro +"/reporteLibroPDF?titulo="+tit+"&anioDesde="+desde+"&anioHasta="+hasta+"&serie="+ser+"&estado="+est+"&idCategoriaLibro="+idCate+"&idEstadoPrestamo="+idEs+"&idTipoLibro="+idTip+"&idEditorial="+idEdi,'',  requestOptions).pipe(map((response)=>{
      return {
          filename: 'ReporteLibro.pdf',
          data: new Blob([response], {type: 'application/pdf'})
      };
  }));
}

generateDocumentExcel(tit:string, desde:number,hasta:number, ser:string, est:number, idCate:number, idEs:number, idTip:number, idEdi:number): Observable<any> {
  const params = new HttpParams()
  .set("titulo", tit)
  .set("anioDesde", desde)
    .set("anioHasta", hasta)
  .set("serie", ser)
  .set("estado", est)
  .set("idCategoriaLibro", idCate)
  .set("idEstadoPrestamo", idEs)
  .set("idTipoLibro", idTip)
  .set("idEditorial", idEdi);

  let headers = new HttpHeaders();
  headers.append('Accept', 'application/vnd.ms-excel');
  let requestOptions: any = { headers: headers, responseType: 'blob' };

  return this.http.post(baseUrlConsultaLibro +"/reporteLibroExcel?titulo="+tit+"&anioDesde="+desde+"&anioHasta="+hasta+"&serie="+ser+"&estado="+est+"&idCategoriaLibro="+idCate+"&idEstadoPrestamo="+idEs+"&idTipoLibro="+idTip+"&idEditorial="+idEdi,'',  requestOptions).pipe(map((response)=>{
    return {
        filename: 'reporteExcel20232.xlsx',
        data: new Blob([response], {type: 'application/vnd.ms-excel'})
    };
}));
}

}
