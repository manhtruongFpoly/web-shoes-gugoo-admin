import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = 'http://localhost:8084/api/v1/category';
  url_groupComponent = 'http://localhost:8080/api/v1/component';

  constructor(
    private httpClient: HttpClient
  ) { }

  createCategory(category: any, file?: any): Observable<any> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('name', category.name);
    formData.append('images', category.images);
    formData.append('status', category.status.toString());
    formData.append('groupId', category.groupId.toString());

    return this.httpClient.post(this.url + "/create", formData);
  }

  editCategory(id: number,category: any, file?: any): Observable<any>{
    const formData = new FormData();

    formData.append('file', file);
    formData.append('name', category.name);
    formData.append('images', category.images);
    formData.append('status', category.status.toString());
    formData.append('groupId', category.groupId.toString());

    return this.httpClient.put(this.url + "/update/" + id,formData);
  }


  getOne(id:number): Observable<any>{
    return this.httpClient.get(this.url + '/' + id);
  }

  getAllGroupcomponent(): Observable<any> {
    return this.httpClient.get(this.url_groupComponent + '/info');
  }

  getAllCategoryAndPage(params: any): Observable<any>{
    return this.httpClient.get(this.url , {params});
  }
  getAllCategory(page: any, pageSize: any): Observable<any> {
    let param = new HttpParams();
    param = param.append('page', page);
    param = param.append('page-size', pageSize);

    return this.httpClient.get(this.url + '?page=' + page + '&page-size=' + pageSize, { params: param });
  }

  deleteCategory(id: number):Observable<any>{
    return this.httpClient.delete(this.url + '/delete/' + id);
  }

  getAllCategoryByGroupId(id:number):Observable<any>{
    return this.httpClient.get(this.url + "/list-group/" + id );
  }
  getAllCategoryByStatus():Observable<any>{
    return this.httpClient.get(this.url + "/list-status" );
  }

}
