import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  url = 'http://localhost:8084/api/v1/brand';

constructor(
  private httpClient: HttpClient
) { }

getAllBrand():Observable<any>{
  return this.httpClient.get(this.url + "/list-brand" );
}

}
