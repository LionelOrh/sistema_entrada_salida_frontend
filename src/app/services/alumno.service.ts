import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Alumno } from '../models/alumno.model';
import { Observable } from 'rxjs';

const baseUrlAlumno = AppSettings.API_ENDPOINT+ '/alumno';
const baseUrlCrudAlumno = AppSettings.API_ENDPOINT+ '/crudAlumno';
const baseUrlConsultaAlumno = AppSettings.API_ENDPOINT+ '/consultaAlumno';


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
  ConsultaAlumnoComplejo(
    nombres: string,
    apellidos: string,
    telefono: string,
    celular: string,
    dni: string,
    correo: string,
    tipoSangre: string,
    fechaNacimientoDesde: string,
    fechaNacimientoHasta: string,
    estado: number,
    idPais: number,
    idModalidad: number
  ):Observable<any>{
    const params = new HttpParams()
    .set("nombres",nombres)
    .set("apellidos",apellidos)
    .set("telefono",telefono)
    .set("celular",celular)
    .set("dni",dni)
    .set("correo",correo)
    .set("tipoSangre",tipoSangre)
    .set("fechaNacimientoDesde",fechaNacimientoDesde)
    .set("fechaNacimientoHasta",fechaNacimientoHasta)
    .set("estado",estado)
    .set("idPais",idPais)
    .set("idModalidad",idModalidad)

    return this.http.get(baseUrlConsultaAlumno + "/consultaAlumnoPorParametros",{params})
  }

  
}
