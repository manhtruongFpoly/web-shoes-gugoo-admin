import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartModel } from '../_model/CartModel';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  url = "http://localhost:8080/api/v1/cart";

  constructor(private http: HttpClient) { }

  getAllCartByUser(): Observable<any> {
      return this.http.get(this.url + "/user");
  }

  getSumTotal(): Observable<any> {
    return this.http.get(this.url + "/sumTotalAndQuantity")
  }

  createCart(cart: CartModel): Observable<any> {
    return this.http.post(this.url + "/addToCart", cart);
  }

  updateCart(id: number, cart: CartModel): Observable<any> {
    return this.http.put(this.url + "/updateQuantity/" + id + '?quantity=' + cart.quantity, cart);
  }

  deleteCart(id: number): Observable<any> {
    return this.http.delete(this.url + "/" + id);
  }

}
