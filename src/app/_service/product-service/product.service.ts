import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const AUTH_API = environment.apiUrl + "v1/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
  ) { }


  searchProduct(data): Observable<any>{
    return this.http.post(AUTH_API + '/search',data);
  }

  createProduct(data): Observable<any>{
    return this.http.post(AUTH_API + '/create/product',data);
  }

  deleteProduct(id): Observable<any>{
    return this.http.delete(AUTH_API + '/delete/' + id);
  }

  updateProduct(data): Observable<any>{
    return this.http.post(AUTH_API + '/update/product',data);
  }

  uploadImage(file?: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(AUTH_API + "/upload-images", formData);
  }

  uploadImages(body: any): Observable<any> {
    const formData = new FormData();
  
    for (let i = 0; i < body.listFileUpload.length; i++) {
      formData.append('files', body.listFileUpload[i]);
    }

    if (body.data.id) {
      formData.append('id', body.data.id);
    }

    formData.append('code', body.data.code);
    formData.append('name', body.data.name);
    formData.append('price', body.data.price);

    if(body.data.discount){
      formData.append('discount', body.data.discount);
    }

    formData.append('categoryId', body.data.categoryId);
    formData.append('brandId', body.data.brandId);
    formData.append('quantity', body.data.quantity);

    if (body.data.description != null) {
      formData.append('description', body.data.description);
    }

    formData.append('listSizes', body.data.listTransSize);
    formData.append('listColors', body.data.listTransColor);
    
    body.listImgDelete.forEach(e => {
      formData.append('listImgDelete', e);
    });
  
    return this.http.post(AUTH_API + "/upload-list-images", formData);
  }

  getOne(id:number) :Observable<any>{
    return this.http.get(AUTH_API + '/get-one/' + id);
  }

  getAllProductsAndSearch(name: any,page: number, pageNumber: number): Observable<any> {
    return this.http.get(AUTH_API + '/search' + "?name=" + name + "&page=" + page + "&page-size=" + pageNumber)
  }

  getAllProduct_byCate(id: number,page: number, pageNumber: number): Observable<any> {
    return this.http.get(AUTH_API +'/category/'+id + "?page=" + page + "&page-size=" + pageNumber);
  }

  getProduct_byIdProduct(id: number,page: number, pageNumber: number): Observable<any> {
    return this.http.get(AUTH_API +'/product-id/'+id + "?page=" + page + "&page-size=" + pageNumber);
  }

  getAllProduct(page: number, pageNumber: number): Observable<any> {
    return this.http.get(AUTH_API + "?page=" + page + "&page-size=" + pageNumber);
  }

}
