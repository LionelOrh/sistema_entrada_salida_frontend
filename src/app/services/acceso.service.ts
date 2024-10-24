import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrlAcceso = AppSettings.API_ENDPOINT + '/acceso';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  constructor(private http: HttpClient) { }

  ConsultaReporte(codigo: number, fecha: Date, estado: number, rol: number): Observable<any> {
    // Formatear la fecha a ISO 8601
    const formattedDate = fecha.toISOString();

    // Crear los parámetros de la solicitud
    const params = new HttpParams()
      .set("codigo", codigo.toString()) // Convertir a string
      .set("fecha", formattedDate) // Usar fecha formateada
      .set("estado", estado.toString()) // Convertir a string
      .set("idRol", rol.toString()); // Convertir a string

    // Realizar la solicitud GET a la API
    return this.http.get(baseUrlAcceso + "/consultaReporteAccesos", { params });
  }
}
