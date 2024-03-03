import {
  AfterViewInit, ChangeDetectorRef,
  Directive,
  ElementRef, EventEmitter,
  HostListener,
  Input, OnChanges,
  OnDestroy,
  OnInit, Output, SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import {BehaviorSubject, combineLatest, merge, Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, filter, tap} from 'rxjs/operators';
import {ESCAPE, hasModifierKey} from '@angular/cdk/keycodes';
import {NgbCalendar, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';
import { POSITION_MAP } from './connection-position-pair';
import { DateModel, DateTimeModel } from '../_model/date.model';

enum CalendarState {
  closed = 'closed',
  opened = 'opened'
}

@Directive(
  {
    selector: '[ktCalendarTrigger]'
  }
)
export class CalendarTriggerDirective implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() ktCalendarTrigger: TemplateRef<any>;
  @Input() ktNgbDatePicker: NgbDatepicker;
  @Input() dateTimePicker: boolean;
  @Input() dateValue: DateTimeModel;
  @Input() caPosition = 'rightTop';
  @Input() triggerBy: 'click' | null = 'click';
  _isConfig: boolean;
  @Input() isConfirm
  @Input() isSchoolYear;
  @Input() elPosition;
  @Output() emitStateIsConfirm: EventEmitter<boolean> = new EventEmitter<false>();
  private calendarState = CalendarState.closed;
  private portal = new ComponentPortal(NgbDatepicker);
  private positions: ConnectionPositionPair[] = [
    POSITION_MAP.bottomRight,
    POSITION_MAP.bottomLeft
  ];
  private overlayRef: OverlayRef;
  private subscription = Subscription.EMPTY;
  private subscriptionConfirm = Subscription.EMPTY;
  private readonly hover$ = new Subject<boolean>();
  private readonly click$ = new Subject<boolean>();

  constructor(
    private calendar: NgbCalendar,
    private el: ElementRef,
    private overlay: Overlay,
    private vCR: ViewContainerRef,
    private cdf: ChangeDetectorRef
  ) {
    // console.log('CONSTRUCTOR');
    // this.isConfirmOb$.subscribe((res) =>{
    //   if(res){
    //     console.log('SUB CRAI', res);
    //     this.closeCalendar();
    //   }
    // })
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.initialize();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionConfirm.unsubscribe();
  }

  // private initialize() {
  //   const hover$ = this.hover$.pipe(
  //     debounceTime(100)
  //   );
  //   const handle$ = this.triggerBy === 'hover' ? hover$ : this.click$;
  //   handle$.pipe(
  //     tap(state => console.log(state))
  //   ).subscribe(value => {
  //     if (value) {
  //       this.openCalendar();
  //       return;
  //     }
  //     this.openCalendar();
  //   });
  // }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.ktCalendarTrigger) {
      return
    }
    // this.click$.next(true);
    this.openCalendar();
  }

  // @HostListener('mouseenter', ['$event'])
  // onMouseEnter() {
  //   this.hover$.next(true)
  // }

  // @HostListener('mouseleave', ['$event'])
  // onMouseLeave() {
  //   this.hover$.next(false)
  // }
  scrollToTime(hour, minute) {
    minute = minute.length === 1 ? '0' + minute : minute
    hour = hour.length === 1 ? '0'
      + hour : hour
    const divHour = document.getElementById(`hour${hour}`);
    const divMinute = document.getElementById(`minute${minute}`);
    // console.log('DIV HOUR', divHour);
    // console.log('DIV MINUTE', divMinute);
    if (divMinute && divHour) {
      divHour.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      });
      divMinute.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      });
    }
  }

  openCalendar() {
    // this.ktCalendarTrigger.open();
    // console.log('XEM DATE VALUE', this.dateValue);
    if (this.dateValue) {
      setTimeout(() => {
        this.scrollToTime(this.dateValue.hour, this.dateValue.minute)
      }, 100)
    }
    const listElement = Array.from(document.getElementsByClassName('ngb-dp-day'));
    listElement?.forEach((item) => {
      item.removeAttribute('tabindex')
    })
    if (this.calendarState === CalendarState.opened) {
      return;
    }
    const overlayConfig = this.getOverlayConfig();
    this.setOverlayPosition(overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy)
    const overlayRef = this.overlay.create(overlayConfig);
    const template = new TemplatePortal<any>(this.ktCalendarTrigger, this.vCR);
    overlayRef.attach(template);
    this.subscribeOverlayEvent(overlayRef);
    this.overlayRef = overlayRef;
    this.calendarState = CalendarState.opened;
    setTimeout(() => {
      if (this.dateValue) {
        this.ktNgbDatePicker.navigateTo(this.dateValue)
        // this.getElementAndReSetWidth(this.dateValue);
      } else {
        // this.getElementAndReSetWidth(this.ktNgbDatePicker.calendar.getToday().month);
      }
    }, 500);
    // console.log('Open CALENDAR', this.calendarState);
  }

  // Get Element And Set Width
  getElementAndReSetWidth(dateValue) {
    // console.log(dateValue);
    this.checkMonthAndSetWidth(dateValue)
  }

  checkMonthAndSetWidth(date: DateModel) {
    const customSelectOne = document.getElementsByClassName('custom-select')[0] as HTMLElement;
    switch (date.month) {
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 10:
        customSelectOne.classList.add('custom-width-daterange__select-default')
        break;
      default:
        customSelectOne.classList.add('custom-width-daterange__select-fitcontent')

    }
  }

  closeCalendar() {
    // console.log('CLOSE CALENDAR :))))', this.calendarState);
    if (this.calendarState === CalendarState.opened) {
      this.overlayRef.detach();
      this.calendarState = CalendarState.closed;
      this._isConfig = false;
      this.emitStateIsConfirm.emit(false);
    }
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.el);
    this.cdf.detectChanges();
    let a = 'pt-menu-panel';
    if (this.isSchoolYear) {
      if (this.isSchoolYear.toString().toUpperCase().includes('createSchoolYear'.toUpperCase())) {
        a = 'pt-menu-panel1';
      } else {
        a = 'pt-menu-panel';
      }
    } else {
      a = 'pt-menu-panel';
    }

    return new OverlayConfig({
      positionStrategy,
      minWidth: '200px',
      hasBackdrop: true,
      backdropClass: 'pt-menu-backdrop',
      panelClass: a.toString(),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    })
  }

  private setOverlayPosition(positionStrategy: FlexibleConnectedPositionStrategy) {
    // alert(this.isSchoolYear)
    if (this.isSchoolYear) {
      if (this.isSchoolYear.toString().toUpperCase().includes('createSchoolYear'.toUpperCase())) {
        //alert(true)
        this.positions = [
          POSITION_MAP.topRight,
          POSITION_MAP.bottomLeft
        ]
      } else {
        // alert(true)
        this.positions = [
          POSITION_MAP.bottomRight,
          POSITION_MAP.bottomLeft
        ]
      }
    } else {
      this.positions = [
        POSITION_MAP.bottomRight,
        POSITION_MAP.bottomLeft
      ]
    }
    positionStrategy.withPositions(this.positions);
  }

  private getPortal(): ComponentPortal<any> {
    this.portal = new ComponentPortal<any>(NgbDatepicker, this.vCR);
    return this.portal;
  }

  private subscribeOverlayEvent(overlayRef: OverlayRef) {
    this.subscription.unsubscribe();
    // this.subscriptionConfirm.unsubscribe();
    this.subscription = merge(
      overlayRef.backdropClick(),
      overlayRef.detachments(),
      overlayRef.keydownEvents().pipe(
        filter(event => event.keyCode === ESCAPE && !hasModifierKey(event))
      )
    ).subscribe((res) => {
      this.closeCalendar();
    });

  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    // console.log('event:', event)
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('CALENDAR STATE', this.calendarState);
    // console.log('DATE TIME PICKER ', this.dateTimePicker);
    if ((changes.dateValue && !this.dateTimePicker)
    ) {
      this.closeCalendar();
    }
    if (changes.isConfirm?.currentValue) {
      // console.log('CHANGE CONFIG STATUS', changes);
      this.closeCalendar();
    }
// console.log('Check CHANGE',changes.isConfirm);
// if(changes.isConfirm){
//   this.closeCalendar(changes.isConfirm);
// }
  }
}
