import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const URL_GHN_GET_province = "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
const URL_GHN_GET_district = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
const URL_GHN_GET_ward = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
const URL_GHN_GET_service = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
const URL_GHN_GET_shipping = " https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";


@Injectable({
  providedIn: 'root'
})
export class GhnService {

  constructor(private http: HttpClient) { }

  getProvince(): Observable<any> {
    return this.http.get(URL_GHN_GET_province);
  }

  getDistrict(id: any): Observable<any> {
    return this.http.get(URL_GHN_GET_district + "?province_id=" + id);
  }

  getWard(id:any): Observable<any> {
    return this.http.get(URL_GHN_GET_ward+"?district_id=" + id);
  }

  getService(data:any): Observable<any>{
    return this.http.post(URL_GHN_GET_service,data);
  }

  getShipping(data:any): Observable<any>{
    return this.http.post(URL_GHN_GET_shipping,data);
  }


}
