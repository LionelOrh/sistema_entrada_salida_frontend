import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Alumno } from '../models/alumno.model';
import { Observable } from 'rxjs';

const baseUrlAlumno = AppSettings.API_ENDPOINT+ '/alumno';
const baseUrlCrudAlumno = AppSettings.API_ENDPOINT+ '/crudAlumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor(private http:HttpClient) {

   }
   
  private baseUrlCrudAlumno = AppSettings.API_ENDPOINT+ '/crudAlumno';

  registra(data:Alumno):Observable<any>{
    return this.http.post(baseUrlAlumno,data);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudAlumno+"/listaAlumnoPorNombreLike/"+ filtro);
  }
  actualizarCrud(data:Alumno):Observable<any>{
    return this.http.put(baseUrlCrudAlumno+"/actualizaAlumno", data);
  }
  registrarCrud(data:Alumno):Observable<any>{
    return this.http.post(baseUrlCrudAlumno+"/registraAlumno", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudAlumno+"/eliminaAlumno/"+id);
  }

  validarNombre(nombre: string):Observable<any>{
    return this.http.get<any>(`${this.baseUrlCrudAlumno}/buscaPorNombreIgual`,{params: {nombre}});
  }
  
}
