import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Autor } from '../models/autor.model';
import { Observable } from 'rxjs';

const baseUrlAutor = AppSettings.API_ENDPOINT+ '/autor';
const baseUrlCrudAutor = AppSettings.API_ENDPOINT + '/crudAutor';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  constructor(private http:HttpClient) { }

  //PC1 - Registrar
  registrar(data:Autor):Observable<any>{
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

}
