import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Editorial } from '../models/editorial.model';
import { Observable } from 'rxjs';

const baseUrlEditorial = AppSettings.API_ENDPOINT+ '/editorial';
const baseUrlCrudEditorial= AppSettings.API_ENDPOINT+'/crudEditorial'
@Injectable({
  providedIn: 'root'
})
export class EditorialService {

  constructor(private http:HttpClient) { }

  registrar(data:Editorial):Observable<any>{
    return this.http.post(baseUrlEditorial, data);
  }


  //PC2-Crud
  registrarCrud(data:Editorial):Observable<any>{
    return this.http.post(baseUrlCrudEditorial+"/registraEditorial",data);
  }
  actualizarCrud(data:Editorial):Observable<any>{
    return this.http.put(baseUrlCrudEditorial+"/actualizaEditorial",data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudEditorial+"/eliminaEditorial/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudEditorial+"/listaEditorialPorRazonSocialLike/"+filtro);
  }
}