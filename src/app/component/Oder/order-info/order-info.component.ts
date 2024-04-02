import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from '../../../_service/order-service/order.service';
import { CancelDialogComponent } from '../cancel-dialog/cancel-dialog.component';
import { Constant } from '../../../_constant/Constant';
import { ConfirmDialogComponent } from '../../../_helper/confirm-dialog/confirm-dialog.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css']
})
export class OrderInfoComponent implements OnInit {

  orderdetail: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private OrderService: OrderService,
    private matDialog: MatDialog,
    private toast: ToastrService,
    private matDialogRef: MatDialogRef<OrderInfoComponent>
  ) { }

  ngOnInit() {
    console.log(this.dataDialog);
    this.getOrderDetail();
  }

  transporting() {

    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
          message: 'Chuyển đơn hàng thành đang vận chuyển?'
      }
    }).afterClosed().subscribe(result => {
        if (result === Constant.RESULT_CLOSE_DIALOG.CONFIRM) {

          this.OrderService.transporting(this.dataDialog.id).subscribe({
            next: res =>{
              this.toast.success('Chuyển trạng thái đơn thành công');
              this.matDialogRef.close('submit');
              // this.ngOnInit();
              window.location.reload()
            },
            error: e =>{
              console.log(e);

              this.toast.error('Chuyển trạng thái đơn thất bại');
            }
          })
        }
    })
  }

  delivered() {

    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
          message: 'Chuyển đơn hàng thành đã giao?'
      }
    }).afterClosed().subscribe(result => {
        if (result === Constant.RESULT_CLOSE_DIALOG.CONFIRM) {

          this.OrderService.confirmDeliveredOrder(this.dataDialog.id).subscribe({
            next: res =>{
              this.toast.success('Chuyển trạng thái đơn thành công');
              this.matDialogRef.close('submit');
              // this.ngOnInit();
              window.location.reload()
            },
            error: e =>{
              console.log(e);

              this.toast.error('Chuyển trạng thái đơn thất bại');
            }
          })
        }
    })
  }

  openEditOrder(order: any){
    this.matDialog.open(EditOrderComponent,{
      width: '700px',
      autoFocus: false,
      data: order
    }).afterClosed().subscribe(res=>{
      if (res == 'submit') {
        this.matDialogRef.close('submit');
      }
    })
  }

  getOrderDetail(){
    this.OrderService.getorderdetail_byid(this.dataDialog.id).subscribe(data => {
      this.orderdetail = data.data.content;
      console.log(this.orderdetail);
    })
  }

  cancel(orderId: any){

    this.matDialog.open(CancelDialogComponent,{
      width: '700px',
      data:
        orderId
    }).afterClosed().subscribe(res=>{
      if (res=='submit') {
        this.matDialogRef.close('submit');
      }
    })

  }

  Confilrm() {
    console.log(this.dataDialog.id);

    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
          message: 'Bạn có muốn xác nhận đơn hàng?'
      }
    }).afterClosed().subscribe(result => {
        if (result === Constant.RESULT_CLOSE_DIALOG.CONFIRM) {

          this.OrderService.confilrm_byidthao(this.dataDialog.id).subscribe({
            next: res =>{
              this.toast.success('Xác nhận đơn thành công');
              this.matDialogRef.close('submit')
              window.location.reload()
            },
            error: e =>{
              console.log(e);

              this.toast.error('Xác nhận đơn thất bại');
            }
          })
        }
    })
  }

  onSubmit(){
    console.log('submit');

  }
  
  closeModal(){
    this.matDialogRef.close();
  }

}
