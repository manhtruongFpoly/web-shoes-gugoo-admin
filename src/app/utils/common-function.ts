// import {Action} from '../model/action.model';
import { PHONE_10_NUMBER, PHONE_9_NUMBER } from "../helpers/constants";
import { ValidateInput } from "../_model/validate-input.model";
import { environment } from "src/environments/environment";
import { Action } from "../_model/action.model";
import * as CryptoJS from 'crypto-js';
import { DateModel } from "../_model/date.model";

export class CommonFunction {

  static stringToObjectDate(date: string): DateModel {
    const dateSplit = date.split('-')
    // tslint:disable-next-line:radix
    return new DateModel(parseInt(dateSplit[0]), parseInt(dateSplit[1]), parseInt(dateSplit[2]))
  }
  static objectDateToStringDateFormat(date): string {
    return `${date.year}-${('0' + date.month).slice(-2)}-${('0' + date.day).slice(-2)}`
  }

  

  // Hàm validate sđt
  static validatePhoneNumber(phone: any) {
    const a = phone?.toString().slice(0, 3);
    if (PHONE_9_NUMBER.find(element => element === a)) {
      if (phone.length === 9)
        return 0;
      return 1;
    } else if (PHONE_10_NUMBER.find(element => element === a)) {
      if (phone.length === 10)
        return 0;
      return 2;
    }
    return 3;
  }


  static isEmpty(data: any): boolean {
    return data == null || data === undefined || data === ''
  }

  static isNotEmpty(data: any): boolean {
    return data !== null && data !== undefined && data !== ''
  }


  static trimText(text){
    if(text !== null && text !== undefined){
      text = text.toString()
      return text.trim()
    }else{
      return null
    }
  }

  static validateInputModel(text,maxLength,regex){
    const result:ValidateInput = new ValidateInput();
    if(this.trimText(text) === null){
      result.empty = true
      return result
    }else{
      text = text.toString()
      text = text.trim()
      if(text.length === 0){
        result.empty = true
        return result
      }
      if(maxLength !== null){
        if(text.length > maxLength){
          result.maxLength = true
          return result
        }
      }
      if(regex !== null){
        if(!text.match(regex)){
          result.regex = true
          return result
        }
      }
    }
  }
  static validateInput(text,maxLength,regex){
    let result:ValidateInput = new ValidateInput();
    if(this.validateInputModel(text,maxLength,regex) !== undefined){
      result = this.validateInputModel(text,maxLength,regex)
    }

    if(result.empty === false && result.maxLength === false && result.regex === false){
      result.done = true
    }
    return result;
  }

  static validateNumberInput(text,maxLength,regex){
    let result:ValidateInput = new ValidateInput();
    if(this.validateInputModel(text,maxLength,regex) !== undefined){
      result = this.validateInputModel(text,maxLength,regex)
    }

    if(result.empty === false && result.maxLength === false && result.regex === false){
      result.done = true
    }

    if (/^[^0-9]+$/.test(text)) {
      result.done = false;
      result.format = true;
    } else {
      result.done = true;
      result.format = false;
    }
    return result;
  }

  static validateInput2(text,isEmpty,maxLength,regex){
    let result:ValidateInput = new ValidateInput();
    if(this.validateInputModel(text,maxLength,regex) !== undefined){
      result = this.validateInputModel(text,maxLength,regex)
    }

    if(!isEmpty){
      if(result.empty === false && result.maxLength === false && result.regex === false){
        result.done = true
      }
    }else{
      if(result.maxLength === false && result.regex === false){
        result.done = true
      }
    }
    return result;
  }

  static validateInputUTF8SpaceModel(text,maxLength,regex, hasUTF8, hasSpace){
    const result:ValidateInput = new ValidateInput();
    const regexUTF8 = /[^\u0000-\u007F]+/;

    if(this.trimText(text) === null){
      result.empty = true
      return result;
    }else{
      text = text.toString()
      text = text.trim()
      if(text.length === 0){
        result.empty = true
        return result;
      }
      if(hasUTF8){
        if (regexUTF8.test(text)) {
          result.UTF8 = true
          return result;
        }
      }
      if(hasSpace){
        if (text.includes(' ')) {
          result.space = true
          return result;
        }
      }
      if(maxLength !== null){
        if(text.length > maxLength){
          result.maxLength = true
          return result;
        }
      }
      if(regex !== null){
        if(!text.match(regex)){
          result.regex = true
          return result;
        }
      }
    }
  }

  static validateInputUTF8Space(text,maxLength,regex, hasUTF8, hasSpace){
    let result:ValidateInput = new ValidateInput()
    if(this.validateInputUTF8SpaceModel(text,maxLength,regex, hasUTF8, hasSpace)!==undefined){
      result = this.validateInputUTF8SpaceModel(text,maxLength,regex, hasUTF8, hasSpace)
    }

    if(result.empty === false && result.UTF8 ===false && result.space ===false && result.maxLength === false && result.regex === false){
      result.done = true
    }
    return result;
  }

  static getSessionStorage(key: string): any {
    let item = sessionStorage.getItem(key);
    if (item === 'undefined') {
      item = undefined;
    } else {
      // item = JSON.parse(item);
      if(item != null){
        let decodeItem = CryptoJS.AES.decrypt(item, environment.CRYPTO)
        item = JSON.parse(decodeItem.toString(CryptoJS.enc.Utf8))
      }
    }
    return item;
  }


  static getActionOfFunction(functionCode){
    // const listFunction = JSON.parse(sessionStorage.getItem('role')).listFunctions
    const listFunction = this.getSessionStorage('role').listFunctions
    let action:Action = new Action()
    let functionDetail = null
    for(let f of listFunction){
      if(f.code === functionCode){
        functionDetail = f
        break
      }
    }

    if(functionDetail?.listActions == null){
      return;
    }

    for(let a of functionDetail?.listActions){
      if(a.code === environment.action.create){
        action.create = true
      }else if(a.code === environment.action.update){
        action.update = true
      }else if(a.code === environment.action.delete){
        action.delete = true
      }else if(a.code === environment.action.search){
        action.search = true
      }else if(a.code === environment.action.export){
        action.export = true
      }else if(a.code === environment.action.detail){
        action.detail = true
      }else if(a.code === environment.action.lock){
        action.lock = true
      }else if(a.code === environment.action.unlock){
        action.unlock = true
      }else if(a.code === environment.action.confirm){
        action.confirm = true
      }else if(a.code === environment.action.handling){
        action.handling = true
      }else if(a.code === environment.action.import){
        action.import = true
      }
    }

    return action;
  }

}
