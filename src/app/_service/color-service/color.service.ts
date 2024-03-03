import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "color/";

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllColor() :Observable<any>{
    return this.http.get(AUTH_API + 'list');
  }
}
