
import {
  ChangeDetectorRef,
  Component, ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef, ViewChild
} from '@angular/core';
import { COMPARE, INVALID, KEYCODE_0, KEYCODE_9, KEYCODE_BACKSPACE, KEYCODE_DOWN, KEYCODE_RIGHT_0, KEYCODE_RIGHT_9, KEYCODE_UP } from 'src/app/helpers/constants';
import { formatDate } from '@angular/common';
import {NgbCalendar, NgbDate, NgbDatepicker, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-input";
import {Subject} from "rxjs";
import {ComponentType} from "@angular/cdk/overlay";

export class ConfigDate {
  hasCustomValidate: boolean;
  compare: Array<Compare>;
}

export class Compare {
  typeCompare: string;
  toCompare:Date;
  messageError: string;
  fromDate?: string;
  toDate?: string;
}

@Component({
  selector: 'kt-date2',
  templateUrl: './date2.component.html',
  styleUrls: ['./date2.component.scss']
})
export class Date2Component implements OnInit, OnChanges {
  @ViewChild('datepicker') ngbDatePicker:NgbInputDatepicker;
  @ViewChild(TemplateRef, {static: true}) menuTemplate: TemplateRef<any>;
  @ViewChild('nativeVariable') nativeElementInput:ElementRef;
  @ViewChild('dp') dp:NgbDatepicker;
  @Input() disable;
  @Input() showMessageInput = true
  @Input() dateValue;
  @Input() messageIllegal;
  @Input() messageNull;
  @Input() config: ConfigDate;
  @Input() isReadOnly;
  @Input() maxDate;

  @Output() dateOutput:any = new EventEmitter<any>();
  @Output() customValidateEmit = new EventEmitter<boolean>()
  @Output() beforeSubmit = new EventEmitter<() => void>()
  @Output() blurEventEmit = new EventEmitter<{}>()
  @Output() clickToOpenNgbDatePicker=  new EventEmitter<any>();
  @Output() emitEventInputRawData = new EventEmitter()
  @Input() isSchoolYear
  hoveredDate: NgbDate | null = null;

  min = {year: 1, month : 1, day : 1};
  max = {year: 9999, month : 12, day : 31}
  model: NgbDateStruct;
  date: {year: number, month: number};
  readonly visible$ = new Subject<boolean>();
  constructor(private calendar: NgbCalendar, private detectChange: ChangeDetectorRef) {
    // console.log(this.dateValueIn);
  }

  // dateValue;
  showErrDate = false;
  messageErrDate;

  ngOnInit(): void {
    this.dateOutput.emit(this.dateValue);
    this.beforeSubmit.emit(() => {this.checkDate(true)})
    if(this.maxDate){
      this.max = this.maxDate;
    }

    // if(this.dateValue){
    //   this.dp.navigateTo(this.dateValue);
    // }
  }

  checkDate(isBlur: boolean, datepicker?: NgbInputDatepicker) {
    this.showErrDate = false;
    if (INVALID.includes(this.dateValue) && this.messageNull) {
      this.showErrDate = true
      this.messageErrDate = this.messageNull;
      this.dateOutput.emit('error');
      return
    }

    if (typeof this.dateValue === 'object' || INVALID.includes(this.dateValue)) {
      this.dateOutput.emit(this.dateValue);
      if (this.config && this.config.hasCustomValidate) {
        const result = this.validateDate()
        this.customValidateEmit.emit(result)
      }
      return;
    }
    this.showErrDate = true
    this.messageErrDate = this.messageIllegal;
    this.dateOutput.emit('error');
  }
  emitEventInputAndGetRawValue(event){
    console.log('INPUT EVENT');
    console.log(event.target.value);
    this.emitEventInputRawData.emit(event.target.value)
  }
  blurEmit(event) {
    this.blurEventEmit.emit(event);
  }
  isHovered(date: NgbDate) {
    return this.dateValue
      && this.hoveredDate;
  }

  validateDate(): boolean {
    this.showErrDate = false
    let result = false
    this.config.compare.every( c => {
      if (typeof c === 'object') {

        const dateValue = `${this.dateValue.year}-${('0' + this.dateValue.month).slice(-2)}-${('0' + this.dateValue.day).slice(-2)}`

        if (c.toCompare) {
          const compare = formatDate( c.toCompare , 'yyyy-MM-dd', 'en_US');
          if (
            (c.typeCompare === COMPARE.GREATER_EQUAL && dateValue < compare) ||
            (c.typeCompare === COMPARE.LESS_EQUAL && dateValue > compare) ||
            (c.typeCompare === COMPARE.LESS_THAN && dateValue >= compare)
          ) {
            this.showErrDate = true
            this.messageErrDate = c.messageError
            result = true
            return false
          }
        }

        if (c.fromDate && c.toDate) {
          if (dateValue < c.fromDate || dateValue > c.toDate) {
            this.showErrDate = true
            this.messageErrDate = c.messageError
            result = true
            return false
          }
        }
      }
      return true
    })
    return result
  }

  interceptKeyboard(event): void {
    // console.log(event);
    if(this.isReadOnly){
      const keyCode = event.keyCode
      if (keyCode === KEYCODE_BACKSPACE || keyCode === 46) {
        this.dateValue = null;
        this.dateOutput.emit(this.dateValue);
        return
      }

      if (
        (keyCode >= KEYCODE_0 && keyCode <= KEYCODE_9) ||
        (keyCode >= KEYCODE_RIGHT_0 && keyCode <= KEYCODE_RIGHT_9) ||
        keyCode === KEYCODE_UP || keyCode === KEYCODE_DOWN) {
        event.preventDefault()
      }
    }
  }

  tooltip(): string {
    if (!this.dateValue) return
    const {day, month, year} = this.dateValue
    const d = ('0' + day).slice(-2)
    const m = ('0' + month).slice(-2)
    return `${d}/${m}/${year}`
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dateValue) {
      this.dateOutput.emit(this.dateValue);
    }
  }

  selectToday(datepicker: NgbDatepicker) {
    this.dateValue = this.calendar.getToday();
    datepicker.navigateTo()
    this.dateOutput.emit(this.dateValue)
  }
  clear(){
    this.dateValue = null;
    this.dateOutput.emit(this.dateValue)
  }
  // Get All Element And remove property tabindex
  removeTabIndex(d: NgbInputDatepicker){
    d.toggle();
    console.log('Xem D la cai gi');
    console.log(d);
    // console.log(this.nativeElementInput);
    const listElement = Array.from(document.getElementsByClassName('ngb-dp-day'));
    listElement?.forEach((item) =>{
      item.removeAttribute('tabindex')
    });
    const language = localStorage.getItem('language');
    const listElementE = Array.from(document.getElementsByClassName('custom-select') as unknown as HTMLCollectionOf<HTMLElement>)
    if(language === 'en'){
      listElementE.forEach(select =>{
        select.style.paddingRight='20px !important'
      })
    }
    // const listNgbDatePickerInput = Array.from(document.getElementsByClassName('ngb-date-picker') as HTMLCollectionOf<HTMLElement>);
    const ngbDatePicker = document.getElementsByTagName('ngb-datepicker')[0] as HTMLElement;
    // const elementByClassName = ngbDatePicker.getElementsByClassName('dropdown-menu') as unknown as HTMLElement;
    // ngbDatePicker.removeAttribute('style');
    // const parentElement = Array.from(document.getElementsByClassName('position-parent'));
    // console.log(this.nativeElementInput);
    // console.log(this.nativeElementInput.nativeElement);
    // console.log(ngbDatePicker);
    // const parent = .parentNode;
    // const wrapper = document.createElement('div');
    // <div class="cdk-overlay-container">
    // <div id="cdk-overlay-0" class="cdk-overlay-pane" dir="ltr">
    //   <!-- Component goes here -->
    // </div>
    // </div>
    //   const parent = ngbDatePicker.parentNode;
    //   const wrapper = document.createElement('div');
    //   wrapper.className='overlay';
    //   parent.replaceChild(wrapper, ngbDatePicker);
    //   wrapper.appendChild(ngbDatePicker);

  }
}

