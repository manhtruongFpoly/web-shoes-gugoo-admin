import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "size/";

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllSize() :Observable<any>{
    return this.http.get(AUTH_API + 'list');
  }

}
