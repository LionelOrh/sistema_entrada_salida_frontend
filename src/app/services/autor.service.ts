import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Autor } from '../models/autor.model';
import { Observable, map } from 'rxjs';

const baseUrlAutor = AppSettings.API_ENDPOINT + '/autor';
const baseUrlCrudAutor = AppSettings.API_ENDPOINT + '/crudAutor';
const baseUrlConsultaAutor = AppSettings.API_ENDPOINT+ '/consultaAutor';


@Injectable({
  providedIn: 'root'
})
export class AutorService {

  constructor(private http: HttpClient) { }

  //PC1 - Registrar
  registrar(data: Autor): Observable<any> {
    return this.http.post(baseUrlAutor, data);
  }

  //PC2 - CRUD
  registrarCrud(data: Autor): Observable<any> {
    return this.http.post(baseUrlCrudAutor + "/registraAutor", data);
  }
  actualizarCrud(data: Autor): Observable<any> {
    return this.http.put(baseUrlCrudAutor + "/actualizaAutor", data);
  }
  eliminarCrud(id: number): Observable<any> {
    return this.http.delete(baseUrlCrudAutor + "/eliminaAutor/" + id);
  }
  consultarCrud(filtro: string): Observable<any> {
    return this.http.get(baseUrlCrudAutor + "/listaAutorPorNombresLike/" + filtro);
  }
  ConsultaAutorComplejo(
    nombres: string,
    apellidos: string,
    fechaNacimientoDesde: string,
    fechaNacimientoHasta: string,
    telefono: string,
    celular: string,
    orcid: string,
    estado: number,
    idPais: number,
    idGrado: number
  ): Observable<any> {
    const params = new HttpParams()
      .set("nombres", nombres)
      .set("apellidos", apellidos)
      .set("fechaNacimientoDesde", fechaNacimientoDesde)
      .set("fechaNacimientoHasta", fechaNacimientoHasta)
      .set("telefono", telefono)
      .set("celular", celular)
      .set("orcid", orcid)
      .set("estado", estado)
      .set("idPais", idPais)
      .set("idGrado", idGrado)

    return this.http.get(baseUrlConsultaAutor + "/consultaAutorPorParametros", { params })
  }


  generateDocumentReport(nom:string, ape:string, desde:string, hasta:string, tel:string, cel:string, orcid:string, est:number, p:number, g:number): Observable<any> {
    const params = new HttpParams()
    .set("nombres", nom)
    .set("apellidos", ape)
    .set("fechaNacimientoDesde", desde)
    .set("fechaNacimientoHasta", hasta)
    .set("telefono", tel)
    .set("celular", cel)
    .set("orcid", orcid)
    .set("estado", est)
    .set("idPais", p)
    .set("idGrado", g);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlConsultaAutor +"/reporteAutorPdf",{params}, requestOptions).pipe(map((response)=>{
      return {
          filename: 'reporteDocente20232.pdf',
          data: new Blob([response], {type: 'application/pdf'})
      };
  }));
}

generateDocumentExcel(nom:string, ape:string, desde:string, hasta:string, tel:string, cel:string, orcid:string, est:number, p:number, g:number): Observable<any> {
  const params = new HttpParams()
  .set("nombres", nom)
  .set("apellidos", ape)
  .set("fechaNacimientoDesde", desde)
  .set("fechaNacimientoHasta", hasta)
  .set("telefono", tel)
  .set("celular", cel)
  .set("orcid", orcid)
  .set("estado", est)
  .set("idPais", p)
  .set("idGrado", g);

  let headers = new HttpHeaders();
  headers.append('Accept', 'application/vnd.ms-excel');
  let requestOptions: any = { headers: headers, responseType: 'blob' };

  return this.http.post(baseUrlConsultaAutor +"/reporteAutorExcel?nombres="+nom+"&apellidos="+ape+"&fechaNacimientoDesde="+desde+"&fechaNacimientoHasta="+hasta+"&telefono="+tel+"&celular="+cel+"&orcid="+orcid+"&estado="+est+"&idPais="+p+"&idGrado="+g,'', requestOptions).pipe(map((response)=>{
    return {
        filename: 'reporteExcel20232.xlsx',
        data: new Blob([response], {type: 'application/vnd.ms-excel'})
    };
}));
}

}
