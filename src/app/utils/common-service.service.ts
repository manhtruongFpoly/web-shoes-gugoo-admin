import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommonServiceService {
  constructor(
    public httpClient: HttpClient,
  ) {}

  
  pagination(current: number, last: number, collapse?: boolean): Array<number> {

    if (collapse) {
      return this.paginationCollapse(current, last);
    } else {
      var delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

      for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || (i >= left && i < right)) {
          range.push(i);
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    }
  }

  paginationCollapse(current: number, last: number): Array<number> {
    const FIRST = 1;
    const delta = 1;

    const  range = [];
    const  rangeWithDots = [];
    let l;

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i === current)) {
        range.push(i);
      }
    }

    for (const i of range) {

      if (l) {
        if (i - l === 2) {
          this.pushRangWithDots(rangeWithDots, l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }

      if (i === last && current === i && i !== FIRST) {
        this.pushRangWithDots(rangeWithDots, i - 1);
      }

      this.pushRangWithDots(rangeWithDots, i);

      if (i === FIRST && current === i && !rangeWithDots.includes(i + 1) && i !== last) {
        this.pushRangWithDots(rangeWithDots, i + 1);
      }

      l = i;
    }

    return rangeWithDots;
  }

  pushRangWithDots(rangeWithDots: Array<number>, index: number) {
    if (!rangeWithDots.includes(index)) {
      rangeWithDots.push(index);
    }
  }
}
