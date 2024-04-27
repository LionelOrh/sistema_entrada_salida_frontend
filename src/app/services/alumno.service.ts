import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Alumno } from '../models/alumno.model';
import { Observable } from 'rxjs';

const baseUrlAlumno = AppSettings.API_ENDPOINT+ '/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor(private http:HttpClient) { }
  registra(data:Alumno):Observable<any>{
    return this.http.post(baseUrlAlumno,data);
  }
}
