import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const baseUrlExterno = AppSettings.API_ENDPOINT + '/externo';

@Injectable({
    providedIn: 'root'
  })

  export class ExternoService {
    constructor(private http:HttpClient) { }
  }