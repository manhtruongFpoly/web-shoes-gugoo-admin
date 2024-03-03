import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
                public readonly storageService: TokenStorageService,
                public readonly router: Router,
                public readonly toastr: ToastrService
                ) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.storageService.isLoggedIn()) {
            void this.router.navigate(['login']);
            return false;
        } else {
            if (next.routeConfig?.path === 'list-management-role') {
                const requiredRole = 'ADMIN';
                const userRole = this.storageService.getUserRole();
                
                if (userRole && userRole === requiredRole) {
                    return true;
                } else {
                    // void this.router.navigate(['access-denied']);
                    this.toastr.warning('Bạn không có quyền truy cập');
                    return false;
                }
            } else {
                return true;
            }
        }
    }

}
