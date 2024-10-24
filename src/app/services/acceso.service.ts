import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const baseUrlAcceso = AppSettings.API_ENDPOINT + '/acceso';

@Injectable({
    providedIn: 'root'
  })

  export class AccesoService {
    constructor(private http:HttpClient) { }
  }