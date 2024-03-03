export class DateModel {
  year: number;
  month: number;
  day: number;

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }
}
export class DateTimeModel {
  year: number;
  month: number;
  day: number;
  hour?:string;
  minute?:string;
  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }
  // Builder Design Pattern
}
