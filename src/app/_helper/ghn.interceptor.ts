import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class GhnInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const token = "0cb0d940-73e3-11ed-bcba-eac62dba9bd9";
    // const set_token = localStorage.setItem('token', token);

    const clonedRequest = req.clone({ headers: req.headers.append('token', '0cb0d940-73e3-11ed-bcba-eac62dba9bd9') });

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
}
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: GhnInterceptor, multi: true },
];
