import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Tesis } from '../models/tesis.model';
import { Observable } from 'rxjs';

const baseUrlTesis = AppSettings.API_ENDPOINT+ '/tesis';

@Injectable({
  providedIn: 'root'
})
export class TesisService {

  constructor(private http:HttpClient) { }

  registrar(data:Tesis):Observable<any>{
    return this.http.post(baseUrlTesis, data);
  }
}
