import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Proveedor } from '../models/proveedor.model';
import { Observable, map } from 'rxjs';

const baseUrlProveedor = AppSettings.API_ENDPOINT+ '/Proveedor';
const baseUrlCrudProveedor= AppSettings.API_ENDPOINT+'/crudProveedor'
const baseUrlConsultaProveedor = AppSettings.API_ENDPOINT + '/consultaProveedor';

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
  // PC3 - CONSULTAR
  ConsultarProveedorComplejo(razonsocial: string, ruc: string,direccion: string, telefono: string, celular: string, contacto:string, estado: number, pais: number,tipoProveedor:number): Observable<any> {
    const params = new HttpParams()
      .set("razonsocial", razonsocial)
      .set("ruc", ruc)
      .set("direccion", direccion)
      .set("telefono", telefono)
      .set("celular", celular)
      .set("contacto", contacto)
      .set("estado", estado)
      .set("idPais", pais)
      .set("idTipoProveedor", tipoProveedor);
    return this.http.get(baseUrlConsultaProveedor + "/consultaProveedorPorParametros", { params });
  }


  generateDocumentReport(razonsocial: string, ruc: string,direccion: string, telefono: string, celular: string, contacto:string, estado: number, pais: number,tipoProveedor:number): Observable<any> {
    const params = new HttpParams()
      .set("razonsocial", razonsocial)
      .set("ruc", ruc)
      .set("direccion", direccion)
      .set("telefono", telefono)
      .set("celular", celular)
      .set("contacto", contacto)
      .set("estado", estado)
      .set("idPais", pais)
      .set("idTipoProveedor", tipoProveedor);
  
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };
  
    return this.http.post(baseUrlConsultaProveedor + "/reporteProveedorPDF", params, requestOptions).pipe(map((response) => {
      return {
        filename: 'reportePDFProveedor.pdf',
        data: new Blob([response], { type: 'application/pdf' })
      };
    }));
  }
  
  generateDocumentExcel(razonsocial: string, ruc: string,direccion: string, telefono: string, celular: string, contacto:string, estado: number, pais: number,tipoProveedor:number): Observable<any> {
    const params = new HttpParams()
      .set("razonsocial", razonsocial)
      .set("ruc", ruc)
      .set("direccion", direccion)
      .set("telefono", telefono)
      .set("celular", celular)
      .set("contacto", contacto)
      .set("estado", estado)
      .set("idPais", pais)
      .set("idTipoProveedor", tipoProveedor);
  
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/vnd.ms-excel');
    let requestOptions: any = { headers: headers, responseType: 'blob' };
  
    return this.http.post(baseUrlConsultaProveedor + "/reporteProveedorExcel", params, requestOptions).pipe(map((response) => {
      return {
        filename: 'reporteExcelProveedor.xlsx',
        data: new Blob([response], { type: 'application/vnd.ms-excel' })
      };
    }));
  }
}