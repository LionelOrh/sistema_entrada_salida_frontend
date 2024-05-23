import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Tesis } from '../models/tesis.model';
import { Observable } from 'rxjs';

const baseUrlTesis = AppSettings.API_ENDPOINT+ '/tesis';
const baseUrlCrudTesis = AppSettings.API_ENDPOINT+ '/crudTesis';

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

  
}
