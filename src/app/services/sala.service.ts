import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sala } from '../models/sala.model';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';

const baseUrlSala = AppSettings.API_ENDPOINT+ '/sala';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  constructor(private http:HttpClient) { }
  
  registrar(data:Sala):Observable<any>{
    return this.http.post(baseUrlSala, data);
  }
}
