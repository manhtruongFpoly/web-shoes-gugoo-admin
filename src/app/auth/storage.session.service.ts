import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class StorageSessionService {
  public readonly SCHOOL_INFO = 'schoolInfo';
  public readonly INFOR_EXAM = 'inforExam';
  private storage: Storage;
  encodeItem: any
  decodeItem: any
  private subjects: Map<string, BehaviorSubject<any>>;

  /**
   * Constructor with service injection
   * @param storage
   */
  constructor() {
    this.storage = sessionStorage;
    this.subjects = new Map<string, BehaviorSubject<any>>();
  }

  /**
   * watch data of given key
   * @param key
   * @param defaultValue
   */
  watch(key: string): Observable<any> {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<any>(null));
    }
    let item = this.storage.getItem(key);
    if (item === 'undefined') {
      item = undefined;
    } else {
      // item = JSON.parse(item);
      if(item != null){
        this.decodeItem = CryptoJS.AES.decrypt(item, environment.CRYPTO)
        item = JSON.parse(this.decodeItem.toString(CryptoJS.enc.Utf8))
      }
    }
    this.subjects.get(key).next(item);
    return this.subjects.get(key).asObservable();
  }

  /**
   * get data of given key
   * @param key
   */
  get(key: string): any {
    let item = this.storage.getItem(key);
    if (item === 'undefined') {
      item = undefined;
    } else {
      // item = JSON.parse(item);
      if(item != null){
        this.decodeItem = CryptoJS.AES.decrypt(item, environment.CRYPTO)
        item = JSON.parse(this.decodeItem.toString(CryptoJS.enc.Utf8))
      }
    }
    return item;
  }

  decodeSchoolInfo(value){
    if(value != null && value !== undefined){
      this.decodeItem = CryptoJS.AES.decrypt(value, environment.CRYPTO)
      value = JSON.parse(this.decodeItem.toString(CryptoJS.enc.Utf8))
    }
    return value
  }

  /**
   * set value on given key
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    if(value != null){
      this.encodeItem = CryptoJS.AES.encrypt(JSON.stringify(value), environment.CRYPTO).toString();
    }
    this.storage.setItem(key, this.encodeItem);
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<any>(value));
    } else {
      this.subjects.get(key).next(value);
    }
  }

  /**
   * remove given key
   * @param key
   */
  remove(key: string) {
    if (this.subjects.has(key)) {
      this.subjects.get(key).complete();
      this.subjects.delete(key);
    }
    this.storage.removeItem(key);
  }

  /**
   * clear all available keys
   */
  clear() {
    this.subjects.clear();
    this.storage.clear();
  }
}
