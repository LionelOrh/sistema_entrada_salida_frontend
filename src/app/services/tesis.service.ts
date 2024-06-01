import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Tesis } from '../models/tesis.model';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

const baseUrlTesis = AppSettings.API_ENDPOINT+ '/tesis';
const baseUrlCrudTesis = AppSettings.API_ENDPOINT+ '/crudTesis';
const baseUrlConsultaTesis = AppSettings.API_ENDPOINT+ '/consultaTesis';

@Injectable({
  providedIn: 'root'
})
export class TesisService {

  constructor(private http: HttpClient) { }

  // PC1 - REGISTRAR
  registrar(data: Tesis): Observable<any> {
    return this.http.post(baseUrlTesis, data);
  }

  // PC2 - CRUD
  registrarCrud(data: Tesis): Observable<any> {
    return this.http.post(baseUrlCrudTesis + "/registraTesis", data);
  }

  actualizarCrud(data: Tesis): Observable<any> {
    return this.http.put(baseUrlCrudTesis + "/actualizaTesis", data);
  }

  eliminarCrud(id: number): Observable<any> {
    return this.http.delete(baseUrlCrudTesis + "/eliminaTesis/" + id);
  }

  consultarCrud(filtro: string): Observable<any> {
    return this.http.get(baseUrlCrudTesis + "/listaTesisPorTituloLike/" + filtro);
  }

  // PC3 - CONSULTAR
  ConsultarTesisComplejo(titulo:string, desde:string, hasta:string, est:number, tema:number, idioma:number, centro:number):Observable<any>{
    const params = new HttpParams()
    .set("titulo", titulo)
    .set("fecDesde", desde)
    .set("fecHasta", hasta)
    .set("estado", est)
    .set("idTema", tema)
    .set("idIdioma", idioma)
    .set("idCentroEstudios", centro);

    return this.http.get(baseUrlConsultaTesis+"/consultaTesisPorParametros", {params});
  }
}
