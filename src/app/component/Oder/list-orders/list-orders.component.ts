import { OrderService } from './../../../_service/order-service/order.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { OrderConfirm } from '../../../_model/OrderConfirm';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { data } from 'jquery';
// import { STATUS } from '../../../_model/status';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/_model/Order';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit {

  listOrder: any[] = [];
  confirmMessage = '';
  orderId!: number;
  getOneOrder: Order = new Order();
  orderDetails: any[] = [];
  reason : any;
  shipping! : number;
  statusC : any;

  status = ['Tất cả','Chờ Xác Nhận', 'Đang Xử Lý',
   'Đang Vận Chuyển','Đã Giao','Đã Hủy'];

  validateFormO!: FormGroup;
  validFormCancelled!: FormGroup;

  constructor(
    private rest: OrderService,
    private modalService: NgbModal,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.getAllOrder();

    // this.validFormCancelled = new FormGroup({
    //   'reason': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(200)]),
    // });

    this.validateFormO = new FormGroup({
      'shipping': new FormControl(null, [Validators.required]),
      'check': new FormControl(null, [Validators.required])
    })
  }

  getAllOrder() {
    this.rest.getAllOrderStatus().subscribe(response => {
      this.listOrder = response.data;
      console.log(this.listOrder);
    })
  }

  confirmUpdateStatus(confirmDialog: TemplateRef<any>, id: number) {
    this.confirmMessage = `Xác nhận cập nhật ?`;
    this.orderId = id;
    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })
  }

  confirmUpdateCancelledStatus(confirmDialog: TemplateRef<any>, id: number) {
    this.confirmMessage = `Xác nhận cập nhật ?`;
    this.orderId = id;
    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })
  }

  confirmUpdateBeingShippedStatus(confirmDialog: TemplateRef<any>, id: number) {
    this.confirmMessage = `Xác nhận cập nhật ?`;
    this.orderId = id;
    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })
  }

  confirmUpdateDeliveredStatus(confirmDialog: TemplateRef<any>, id: number) {
    this.confirmMessage = `Xác nhận cập nhật ?`;
    this.orderId = id;
    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })
  }

  getOne(id: number) {
    this.rest.getOneOrder(id).subscribe(response => {
      this.getOneOrder = response.data;
      console.log(response.data);
    })
    this.rest.getOneOrderDetail(id).subscribe(response => {
      this.orderDetails = response.data;
      console.log(response.data);
    })
  }


  confirmCancelled() {
    this.rest.canceledOrder(this.orderId,this.reason)
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

  confirmOrder(){
    this.rest.confilrm_byid(this.orderId,this.shipping)
    .subscribe(response=>{
      this.ngOnInit();
      console.log(this.shipping + "sạdhaj");
      this.toast.success('Order confirm successfully');
    }, error => {
      this.toast.error('Orders confirm fail');
      console.log(error);
      this.ngOnInit();
    });
  }

  confirmDelivered(){
    this.rest.confirmDeliveredOrder(this.orderId)
    .subscribe(response=>{
      this.statusC = response.data.status;
      if(this.statusC == 'CHOXACNHAN'){
        this.ngOnInit();
        this.toast.error('Status is pending confirmation');
      }else if(this.statusC == 'DANGXULY'){
        this.ngOnInit();
        this.toast.error('Processing status');
      }else{
        this.ngOnInit();
        this.toast.success('Order confirm successfully');
      }
    }, error => {
      this.toast.error('Orders confirm fail');
      console.log(error);
      this.ngOnInit();
    });
  }

  confirmBeingShipper(){
    this.rest.confirmBeingShipperOrder(this.orderId)
    .subscribe(response=>{
      this.statusC = response.data.status;
      if(this.statusC == 'DANGXULY'){
        this.ngOnInit();
        this.toast.error('Status is pending confirmation');
      }else{
        this.ngOnInit();
        this.toast.success('Order confirm successfully');
      }

    }, error => {
      this.toast.error('Orders confirm fail');
      console.log(error);
      this.ngOnInit();
    });
  }




  getAll_choxacnhan() {
    this.rest.getAll_CHOXACNHAN().subscribe(data => {
      this.listOrder = data.data;
      console.log(data);
    })

  }

  getAll_DANGXULY() {
    this.rest.getAll_DANGXULY().subscribe(data => {
      this.listOrder = data.data;
      console.log(data);
    })

  }

  getAll_DANGVANCHUYEN() {
    this.rest.getAll_DANGVANCHUYEN().subscribe(data => {
      this.listOrder = data.data;
      console.log(data);
    })

  }
  getAll_DAGIAO() {
    this.rest.getAll_DAGIAO().subscribe(data => {
      this.listOrder = data.data;
      console.log(data);
    })

  }

}
