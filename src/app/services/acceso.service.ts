import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
