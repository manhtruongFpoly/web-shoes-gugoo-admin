import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/_model/User';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../token-storage-service/token-storage.service';

const AUTH_API = environment.apiUrl + "auth";
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLogin: any = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    ) { }


    login(user: User) :Observable<any>{
      return this.http.post(AUTH_API + '/login',user);
    }

    logout(){
      this.tokenStorageService.clearUser();
      window.location.reload();
      // this.toast.success({summary:'Đăng xuất thành công', duration:3000});
    }

    registerAccount(data){
      return this.http.post(AUTH_API + "/signup", data);
    }



}
