import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sala } from '../models/sala.model';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';

const baseUrlSala = AppSettings.API_ENDPOINT+ '/sala';
const baseUrlCrudSala = AppSettings.API_ENDPOINT+ '/crudSala';


@Injectable({
  providedIn: 'root'
})
export class SalaService {

  private baseUrlCrudSala = AppSettings.API_ENDPOINT+ `/crudSala`;

  constructor(private http:HttpClient) { }
  
    //PC1 - Registrar
    registrar(data:Sala):Observable<any>{
      return this.http.post(baseUrlSala, data);
    }
    //PC2 - CRUD
    registrarCrud(data:Sala):Observable<any>{
      return this.http.post(baseUrlCrudSala+"/registraSala", data);
    }
    actualizarCrud(data:Sala):Observable<any>{
      return this.http.put(baseUrlCrudSala+"/actualizaSala", data);
    }
    eliminarCrud(id:number):Observable<any>{
      return this.http.delete(baseUrlCrudSala+"/eliminaSala/"+id);
    }
    consultarCrud(filtro:string):Observable<any>{
      return this.http.get(baseUrlCrudSala+"/listaSalaPorNumeroLike/"+ filtro);
    }
    validarNumero(numero: string): Observable<any> {
      return this.http.get<any>(`${this.baseUrlCrudSala}/buscaPorNumeroIgual`, { params: { numero } });
    }

}
