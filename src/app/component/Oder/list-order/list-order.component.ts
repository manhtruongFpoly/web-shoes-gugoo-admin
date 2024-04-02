import { data } from 'jquery';
import { OrderService } from './../../../_service/order-service/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { CancelDialogComponent } from '../cancel-dialog/cancel-dialog.component';
import { OrderInfoComponent } from '../order-info/order-info.component';
import { EditAddessComponent } from '../edit-addess/edit-addess.component';
import { EditShipNameComponent } from '../edit-ship-name/edit-ship-name.component';
import { SessionStorageService } from 'src/app/_service/session-service/session-storage.service';
@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {

  stepIndex: any = 'CHOXACNHAN';

  order: any = [];
  order1: any = [];
  order2: any = [];
  order3: any = [];
  order4: any = [];
  orderdetaila: any = [];
  orderdetaila1: any = [];
  orderdetaila2: any = [];
  order_status: any = [];
  Id!: number;
  validateFormO!: FormGroup;
  validFormCancelled!: FormGroup;
  Id1!: number;
  reason : any;
  order_status1: any[] = [];
  order_status2: any[] = [];
  count = 0;
  list_order: any = [];
  isLoading: boolean = false;

  formSearch = this.fb.group({
    mahd: [''],
  })

  constructor(
    private toastr: ToastrService,
    private sessionService: SessionStorageService,
    private modalService: NgbModal,
    private rest: OrderService,
    private toast: ToastrService,
    private _formBuilder: FormBuilder,
    private OrderService: OrderService,
    private matdialog: MatDialog,
    private fb: FormBuilder
  ) { }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['', Validators.required],
  });
  fifthFormGroup = this._formBuilder.group({
    fifthCtrl: ['', Validators.required],
  });
  sixthFormGroup = this._formBuilder.group({
    sixthCtrl: ['', Validators.required],
  });
  confirmMessage = '';

  ngOnInit(): void {
    // this.getall();
    // this.getAllOrder();
    // this.getAll_choxacnhan();
    this.getAllInit();
    // this.validateFormO = new FormGroup({
    //   'shipping': new FormControl(null, [Validators.required]),
    //   'check': new FormControl(null, [Validators.required])
    // })
  }

  // sumPriceOrderDetail() {
  //   this.restOrder.sumPriceOrderDetail(this.tokenStorageService.get('id_order')).subscribe((res: any) => {
  //     this.total = this.totalAmount;
  //   })
  // }


  searchMaHD(){
    console.log(this.formSearch.value.mahd);
    console.log(this.stepIndex);

    if (this.formSearch.value.mahd=='') {
      if (this.stepIndex == 'CHOXACNHAN') {
        this.getAll_choxacnhan();
      }else if (this.stepIndex == 'DANGXULY') {
        this.getAll_DANGXULY();
      }else if (this.stepIndex == 'DANGVANCHUYEN') {
        this.getAll_DANGVANCHUYEN();
      }else if (this.stepIndex == 'DAGIAO') {
        this.getAll_DAGIAO();
      }else if (this.stepIndex == 'DAHUY') {
        this.getAll_DAHUY();
      }else{
        this.getAllOrder();
      }
    }else{
      this.OrderService.searchMaHD(this.formSearch.value.mahd,this.stepIndex).subscribe({
        next: res=>{

          let orderArr = [];
          orderArr.push(res.data);
          console.log(orderArr);


          if (this.stepIndex == 'CHOXACNHAN') {
            this.order = orderArr;
          }else if (this.stepIndex == 'DANGXULY') {
            this.order1 = orderArr;
          }else if (this.stepIndex == 'DANGVANCHUYEN') {
            this.order2 = orderArr;
          }else if (this.stepIndex == 'DAGIAO') {
            this.order3 = orderArr;
          }else if (this.stepIndex == 'DAHUY') {
            this.order4 = orderArr;
          }else{
            this.getAllOrder();
          }
        },
        error:e =>{
          console.log(e);
          this.toast.error(e.error.message);
        }
      })
    }


  }

  setStepIndex(status: any){

    this.stepIndex = status;
    console.log(this.stepIndex);


  }

  getAllstatuss() {
    this.isLoading = true;
    this.rest.getAllstatus().subscribe(data => {
      this.isLoading = false;
      this.order_status1 = data.data;
      console.log(this.order_status1);
    })
  }

  getAllOrder() {
    this.OrderService.getAllOrderStatus().subscribe(response => {
      this.order = response.data;
      console.log(this.list_order);
    })
  }


  getAll_choxacnhan() {
    this.OrderService.getAll_CHOXACNHAN().subscribe(data => {
      this.order = data.data;
      console.log(data);
    })

  }
  getAll_DANGXULY() {
    this.OrderService.getAll_DANGXULY().subscribe(data => {
      this.order1 = data.data;
      console.log(data);
    })

  }
  filter(e: any) {
    let condition = e.target.value;

    if (condition) {
      console.log(condition);
      this.rest.getAllby_status(condition).subscribe(data => {

        this.order_status2 = data.data;
        console.log(this.order_status2);


      })
    }

  }
  getAll_DANGVANCHUYEN() {
    this.OrderService.getAll_DANGVANCHUYEN().subscribe(data => {
      this.order2 = data.data;
      console.log(data);
    })

  }
  getAll_DAGIAO() {
    this.OrderService.getAll_DAGIAO().subscribe(data => {
      this.order3 = data.data;
      console.log(data);
    })

  }
   confirmDeleteProduct(confirmDialog: TemplateRef<any>, id: number) {
    this.confirmMessage = `Chi tiết đơn hàng `;
    this.Id = id;
    console.log(this.Id);
    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })
  }

  openOrderInfo(order: any){
    this.matdialog.open(OrderInfoComponent,{
      width: '700px',
      data: order
    }).afterClosed().subscribe(res=>{
      if (res=='submit') {
        this.getAllInit();
      }
    })
  }

  getAllInit(){
    this.getAll_choxacnhan();
    this.getAll_DANGXULY();
    this.getAll_DANGVANCHUYEN();
    this.getAll_DAGIAO();
    this.getAll_DAHUY();
  }

  orderdetail(confirmDialog: TemplateRef<any>, id: number) {

    this.Id = id;
    console.log(this.Id);
    this.OrderService.getorderdetail_byid(this.Id).subscribe(data => {
      this.orderdetaila = data.data.content;
      console.log(this.orderdetaila);

    })

    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })

  }
  orderdetail1(confirmDialog: TemplateRef<any>, id: number) {

    this.Id1 = id;
    console.log(this.Id1);
    this.OrderService.getorderdetail_byid(this.Id1).subscribe(data => {
      console.log(this.Id1);
      this.orderdetaila1 = data.data.content;

      console.log(this.orderdetaila1);

    })

    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })

  }
  orderdetail2(confirmDialog: TemplateRef<any>, id: number) {

    this.Id1 = id;
    console.log(this.Id1);
    this.OrderService.getorderdetail_byid(this.Id1).subscribe(data => {
      console.log(this.Id1);
      this.orderdetaila2 = data.data.content;

      console.log(this.orderdetaila2);

    })

    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })

  }

  editOrder(data: any){
    this.matdialog.open(EditAddessComponent,{
      width: '700px',
      data: data
    }).afterClosed().subscribe(res=>{
      if (res=='submit') {
        this.getAllInit();
      }
    })
  }

  editAddress(data: any){
    this.matdialog.open(EditAddessComponent,{
      width: '700px',
      data: data
    }).afterClosed().subscribe(res=>{
      if (res=='submit') {
        this.getAllInit();
      }
    })
  }
  editShipName(data: any){
    this.matdialog.open(EditShipNameComponent,{
      width: '700px',
      data: data
    }).afterClosed().subscribe(res=>{
      if (res=='submit') {
        this.getAllInit();
      }
    })
  }

  Confilrm() {
    if (this.Id != null) {

      this.OrderService.confilrm_byidthao(this.Id).subscribe(data => {

        this.modalService.dismissAll();
        this.toast.success('Xác Nhận Thành Công');

        this.getAll_choxacnhan();
        this.getAll_DANGXULY();
      })
    }
  }
  transporting() {
    if (this.Id1 != null) {

      this.OrderService.transporting(this.Id1).subscribe(data => {

        this.modalService.dismissAll();
        this.toast.success('Cập Nhật Thành Công');
        this.getAll_DANGVANCHUYEN();
        this.getAll_DANGXULY();
      })
    }
  }
  delivered() {
    if (this.Id1 != null) {

      this.OrderService.confirmDeliveredOrder(this.Id1).subscribe(data => {

        this.modalService.dismissAll();
        this.toast.success('Cập Nhật Thành Công');
        this.getAll_DANGVANCHUYEN();
       this. getAll_DAGIAO();
      })
    }
  }

  cancel(){

    this.matdialog.open(CancelDialogComponent,{
      width: '700px'
    }).afterClosed().subscribe(res=>{
      if (res=='submit') {
        this.getAllInit();
      }
    })

  }

  getAll_DAHUY() {
    this.OrderService.getAll_DAHUY().subscribe(data => {
      this.order4 = data.data;
      console.log(data);
    })

  }
  getall(){
    this.OrderService.getall().subscribe(data=>{
      this.order=data.data;
      console.log(data);
  })

}
confirmCancelled() {
  this.rest.canceledOrder(this.Id,this.reason)
    .subscribe(response => {
      this.toast.success('Order cancel successfully');
      console.log(this.reason + "ádjkja");
      this.ngOnInit();
    }, error => {
      this.toast.error('Orders cannot be canceled');
      console.log(error);
      this.ngOnInit();
    });
}

}
