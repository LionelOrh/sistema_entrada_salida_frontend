import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../models/tipoDocumento.model';
import { Rol } from '../models/rol.model';

const baseUrlUtil = AppSettings.API_ENDPOINT+ '/util';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http:HttpClient) { }

  listaTipoDocumento():Observable<TipoDocumento[]>{
    return this.http.get<TipoDocumento[]>(baseUrlUtil+"/listaTipoDoc");
  }

  listaRol():Observable<Rol[]>{
    return this.http.get<Rol[]>(baseUrlUtil+"/listaRol");
  }
}


