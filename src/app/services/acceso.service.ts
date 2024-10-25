import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

const baseUrlAcceso = AppSettings.API_ENDPOINT + '/verConsultaReporte';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  constructor(private http: HttpClient) { }

  consultaReporteAccesos(
    codigo: string,
    fechaDesde: string,
    fechaHasta: string,
    idRol: number
  ): Observable<any> {
    const params = new HttpParams()
      .set("codigo", codigo)
      .set("fechaDesde", fechaDesde)
      .set("fechaHasta", fechaHasta)
      .set("idRol", idRol)

    return this.http.get(baseUrlAcceso + "/consultaReporteAccesos", { params });
  }

  generateDocumentExcel(
    codigo: string,
    fechaDesde: string,
    fechaHasta: string,
    idRol: number): Observable<any> {
    const params = new HttpParams()
      .set("codigo", codigo)
      .set("fechaDesde", fechaDesde)
      .set("fechaHasta", fechaHasta)
      .set("idRol", idRol);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/vnd.ms-excel');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlAcceso +
      "/reporteAccesos?codigo=" + codigo +
      "&fechaDesde=" + fechaDesde +
      "&fechaHasta=" + fechaHasta +
      "&idRol=" + idRol, '', requestOptions).pipe(map((response) => {
        return {
          filename: 'ReporteAccesos.xlsx',
          data: new Blob([response], { type: 'application/vnd.ms-excel' })
        };
      }));
  }

  generateDocumentReport(
    codigo: string,
    fechaDesde: string,
    fechaHasta: string,
    idRol: number): Observable<any> {
      const params = new HttpParams()
      .set("codigo", codigo)
      .set("fechaDesde", fechaDesde)
      .set("fechaHasta", fechaHasta)
      .set("idRol", idRol);
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlAcceso +"/reportePDF?codigo=" + codigo +
      "&fechaDesde=" + fechaDesde +
      "&fechaHasta=" + fechaHasta +
      "&idRol=" + idRol, '', requestOptions).pipe(map((response)=>{
      return {
          filename: 'ReporteAccesos.pdf',
          data: new Blob([response], {type: 'application/pdf'})
      };
  }));
}
}
