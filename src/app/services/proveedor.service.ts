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
  validaRucActualiza(ruc: string): Observable<any> {
    return this.http.get(baseUrlCrudProveedor + "/buscarProveedorPorRucActualiza", {
      params: { ruc }
    });
  }
  validaRazonSocial(razonsocial: string): Observable<any> {
    return this.http.get(baseUrlCrudProveedor + "/buscarProveedorPorRazonSocialActualiza", {
        params: { razonsocial }
    });
  }
  validaCelular(celular: string): Observable<any> {
    return this.http.get(baseUrlCrudProveedor + "/buscarProveedorPorCelularActualiza", {
        params: { celular }
    });
  }
  validaContacto(contacto: string): Observable<any> {
    return this.http.get(baseUrlCrudProveedor + "/buscarProveedorPorContactoActualiza", {
        params: { contacto }
    });
  }
}