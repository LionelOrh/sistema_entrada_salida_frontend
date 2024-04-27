import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Libro } from '../models/libro.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const baseUrlLibro = AppSettings.API_ENDPOINT+ '/libro';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  constructor(private http:HttpClient) { }

  registrar(data:Libro):Observable<any>{
    return this.http.post(baseUrlLibro, data);
  }

  
}
