import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SprinnerService {

  private loading = new BehaviorSubject<boolean>(false);
  $loading = this.loading.asObservable();

  changeLoading(isShow: boolean) {
      this.loading.next(isShow);
  }

}
