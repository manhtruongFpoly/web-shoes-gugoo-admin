import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticalService {
  url = 'http://localhost:8080/api/v1/thong-ke';
  constructor(private http: HttpClient) {}



  //lay du lieu co trong database
  getMonthYear(month:Date,year:Date) {
    return this.http.get(this.url+'/list/month/'+year+"/"+month);
  }

  getDate():Observable<any> {
    return this.http.get(this.url+'/dateNow');
  }
  //Thống kê hóa đơn và doanh thu tháng + năm
  getmonthyear():Observable<any> {
    return this.http.get(this.url+'/list/month-year');
  }

  getYear(year:Date) {
    return this.http.get(this.url+'/list/'+year);
  }

  //lay so nam
  getall():Observable<any> {
    return this.http.get(this.url+'/list');
  }

  //ThongKeTuTruocToiNay
  getThongKeTuTruocToiNay():Observable<any>{
    return this.http.get(this.url+'/ThongKeTuTruocToiNay');
  }

  getListHoaDonTungThangTheoNam(year: any): Observable<any>{
    return this.http.get(this.url + '/listHoaDonTungThangTheoNam?year=' + year);
  }

  getListHoaDonTungNgayTheoThangVaNam(month: any, year: any): Observable<any>{
    return this.http.get(this.url + '/listHoaDonTungNgayTheoThangVaNam?month='+month+'&year='+year);
  }

  //top product
  getTopProduct(top: any):Observable<any> {
    return this.http.get(this.url+'/top-product/'+top);
  }

}
