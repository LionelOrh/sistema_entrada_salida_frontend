import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Proveedor } from '../models/proveedor.model';
import { Observable } from 'rxjs';

const baseUrlProveedor = AppSettings.API_ENDPOINT + '/verAccesoProveedor';

@Injectable({
    providedIn: 'root'
  })

  export class ProveedorService {
    constructor(private http:HttpClient) { }

    registrar(data: Proveedor): Observable<any> {
      return this.http.post(baseUrlProveedor + "/registraProveedor", data);
    }
  }