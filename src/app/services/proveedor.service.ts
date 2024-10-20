import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const baseUrlProveedor = AppSettings.API_ENDPOINT + '/proveedor';

@Injectable({
    providedIn: 'root'
  })

  export class ProveedorService {
    constructor(private http:HttpClient) { }
  }