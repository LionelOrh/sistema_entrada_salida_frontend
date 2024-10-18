import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';

const baseUrlUtil = AppSettings.API_ENDPOINT+ '/util';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http:HttpClient) { }

 
}


