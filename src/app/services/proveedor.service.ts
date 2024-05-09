import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Proveedor } from '../models/proveedor.model';
import { Observable } from 'rxjs';

const baseUrlProveedor = AppSettings.API_ENDPOINT+ '/Proveedor';
const baseUrlCrudProveedor= AppSettings.API_ENDPOINT+'/crudProveedor'

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private http:HttpClient) { }

  registrar(data:Proveedor):Observable<any>{
    return this.http.post(baseUrlProveedor, data);
  }
   //PC2-Crud
   registrarCrud(data:Proveedor):Observable<any>{
    return this.http.post(baseUrlCrudProveedor+"/registraProveedor",data);
  }
  actualizarCrud(data:Proveedor):Observable<any>{
    return this.http.put(baseUrlCrudProveedor+"/actualizaProveedor",data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudProveedor+"/eliminaProveedor/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudProveedor+"/listaProveedorPorRazonSocialLike/"+filtro);
  }
}