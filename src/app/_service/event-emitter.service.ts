import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EventEmitterService {
  constructor() {}
  search = new EventEmitter();

  searchEmitter(data) {
    this.search.emit(data);
  }
}
