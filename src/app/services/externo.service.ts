import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Externo } from '../models/externo.model';
import { Observable } from 'rxjs';

const baseUrlExterno = AppSettings.API_ENDPOINT + '/personaExterna';

@Injectable({
    providedIn: 'root'
  })

  export class ExternoService {
    constructor(private http:HttpClient) { 
    }

    registrar(data: Externo): Observable<any> {
      return this.http.post(baseUrlExterno + "/registraPersonaExterna", data);
    }
  }

  