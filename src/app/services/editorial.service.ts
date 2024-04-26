import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Editorial } from '../models/editorial.model';
import { Observable } from 'rxjs';

const baseUrlEditorial = AppSettings.API_ENDPOINT+ '/editorial';

@Injectable({
  providedIn: 'root'
})
export class EditorialService {

  constructor(private http:HttpClient) { }

  registrar(data:Editorial):Observable<any>{
    return this.http.post(baseUrlEditorial, data);
  }
}