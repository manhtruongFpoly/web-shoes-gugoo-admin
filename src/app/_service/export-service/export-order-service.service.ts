import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const URL_ORDER = "http://localhost:8080/api/v1/export/order";

@Injectable({
  providedIn: 'root'
})
export class ExportOrderServiceService {

constructor(
  private http: HttpClient
) { }

    exportOrder(id:any):Observable<any>{
      return this.http.get(URL_ORDER + "/" + id);
    }

}
