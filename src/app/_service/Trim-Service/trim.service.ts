import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TrimService {

  constructor() { }

  inputTrim(formGroup: FormGroup,name: string[]) {
    if (name.length>0) {
      for (let i = 0; i < name.length; i++) {
        formGroup.get(name[i])?.setValue(formGroup.get(name[i])?.value.trim());
      }
    }
  }
}
