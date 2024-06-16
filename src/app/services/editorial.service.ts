import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Editorial } from '../models/editorial.model';
import { Observable, map } from 'rxjs';

const baseUrlEditorial = AppSettings.API_ENDPOINT + '/editorial';
const baseUrlCrudEditorial = AppSettings.API_ENDPOINT + '/crudEditorial'
const baseUrlConsultaEditorial = AppSettings.API_ENDPOINT + '/consultaEditorial';

@Injectable({
  providedIn: 'root'
})
export class EditorialService {

  constructor(private http: HttpClient) { }

  registrar(data: Editorial): Observable<any> {
    return this.http.post(baseUrlEditorial, data);
  }


  //PC2-Crud
  registrarCrud(data: Editorial): Observable<any> {
    return this.http.post(baseUrlCrudEditorial + "/registraEditorial", data);
  }
  actualizarCrud(data: Editorial): Observable<any> {
    return this.http.put(baseUrlCrudEditorial + "/actualizaEditorial", data);
  }
  eliminarCrud(id: number): Observable<any> {
    return this.http.delete(baseUrlCrudEditorial + "/eliminaEditorial/" + id);
  }
  consultarCrud(filtro: string): Observable<any> {
    return this.http.get(baseUrlCrudEditorial + "/listaEditorialPorRazonSocialLike/" + filtro);
  }
  validaRucActualiza(ruc: string): Observable<any> {
    return this.http.get(baseUrlCrudEditorial + "/buscarEditorialPorRucActualiza", {
      params: { ruc }
    });
  }
  validaRazonSocial(razonSocial: string): Observable<any> {
    return this.http.get(baseUrlCrudEditorial + "/buscarEditorialPorRazonSocialActualiza", {
      params: { razonSocial }
    });
  }
  // PC3 - CONSULTAR
  ConsultarEditorialComplejo(razonSocial: string, direccion: string, ruc: string, gerente: string, desde: string, hasta: string, estado: number, pais: number): Observable<any> {
    const params = new HttpParams()
      .set("razonSocial", razonSocial)
      .set("direccion", direccion)
      .set("ruc", ruc)
      .set("gerente", gerente)
      .set("fecDesde", desde)
      .set("fecHasta", hasta)
      .set("estado", estado)
      .set("idPais", pais)
    return this.http.get(baseUrlConsultaEditorial + "/consultaEditorialPorParametros", { params });
  }

  generateDocumentReport(razonSocial: string, direccion: string, ruc: string, gerente: string, desde: string, hasta: string, estado: number, pais: number): Observable<any> {
    const params = new HttpParams()
      .set("razonSocial", razonSocial)
      .set("direccion", direccion)
      .set("ruc", ruc)
      .set("gerente", gerente) 
      .set("fecDesde", desde)
      .set("fecHasta", hasta)
      .set("estado", estado)
      .set("idPais", pais); 
  
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };
  
    return this.http.post(baseUrlConsultaEditorial + "/reporteEditorialPDF", params, requestOptions).pipe(map((response) => {
      return {
        filename: 'reportePDFEditorial.pdf',
        data: new Blob([response], { type: 'application/pdf' })
      };
    }));
  }
  
  generateDocumentExcel(razonSocial: string, direccion: string, ruc: string, gerente: string, desde: string, hasta: string, estado: number, pais: number): Observable<any> {
    const params = new HttpParams()
      .set("razonSocial", razonSocial)
      .set("direccion", direccion)
      .set("ruc", ruc)
      .set("gerente", gerente) 
      .set("fecDesde", desde)
      .set("fecHasta", hasta)
      .set("estado", estado)
      .set("idPais", pais); 
  
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/vnd.ms-excel');
    let requestOptions: any = { headers: headers, responseType: 'blob' };
  
    return this.http.post(baseUrlConsultaEditorial + "/reporteEditorialExcel", params, requestOptions).pipe(map((response) => {
      return {
        filename: 'reporteExcelEditorial.xlsx',
        data: new Blob([response], { type: 'application/vnd.ms-excel' })
      };
    }));
  }
  


}