import { OrderService } from './../../../_service/order-service/order.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../../_helper/confirm-dialog/confirm-dialog.component';
import { Constant } from '../../../_constant/Constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

  orderdetail: any = [];

  displayedColumns: string[] = ['price', 'quantity', 'product', 'image', 'func'];
  dataSource!: MatTableDataSource<any>;
  list: any = [];
  sl1: any ;
  listQuantity: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private OrderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private toast: ToastrService,
    private matDialogRef: MatDialogRef<EditOrderComponent>,
    private service: OrderService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.getOrderDetail();
  }

  getOrderDetail(){
    console.log(this.dataDialog);

    this.OrderService.getorderdetail_byid(this.dataDialog.id).subscribe(data => {
      this.orderdetail = data.data.content;
      this.dataSource = new MatTableDataSource<any>(data.data.content);
      this.list = data.data.content;
      console.log('List Order detail');
      console.log(this.list);

      //push quantity
      for (let i = 0; i < this.list.length; i++) {
        this.listQuantity.push(this.list[i].quantity)
      }
      this.dataSource.data = data.data.content;
      this.dataSource.paginator = this.paginator;

    })
  }

  deleteOrderDetail(id: any){
    if (this.list.length <=1) {
      this.toast.warning('Không được xóa hết sản phẩm');
      return;
    }
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
          message: 'Bạn có muốn xóa sản phẩm?'
      }
    }).afterClosed().subscribe(result => {
        if (result === Constant.RESULT_CLOSE_DIALOG.CONFIRM) {
          console.log('xóa: '+ id);
          this.OrderService.deleteOrderDetail(id).subscribe({
            next: res=>{
              // console.log(res);
              this.toast.success('Xóa thành công!');
              this.getOrderDetail();
            },
            error: e =>{
              console.log(e);
              this.toast.error('Xóa thất bại!');

            }
          })
        }
    })
  }

  setQuantity(event: any, index: any, data: any){
    // data lấy số lượng còn lại trên db nhưng không có id của product mà chỉ có name của product
    console.log(data);
    console.log('event');
    console.log(parseInt(event.target.value));



    if (event.target.value=='') {
      // event.target.value = oldQty;
      this.toast.warning('Số lượng không được để trống');
      return;
    }
    if (parseInt(event.target.value)<=0) {
      this.sl1=0;
      this.list[index].quantity = parseInt(event.target.value);
      this.toast.warning('Số lượng phải lớn hơn 0');
      return;
    }
    if (parseInt(event.target.value)>0) {
      this.sl1=1;
      this.list[index].quantity = parseInt(event.target.value);
    }

  }

  deleteProduct(){
    //chưa có api
    console.log('delete product');

  }

  checkQuantity(){
    console.log(this.list);

    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].quantity<1) {
        this.toast.warning('Số lượng phải lớn hơn 0');
        return;
      }

    }
  }

  onSubmit(){
    console.log(this.list);

    let check = 0;
    this.checkQuantity();
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
          message: 'Bạn có muốn cập nhật đơn hàng?'
      }
    }).afterClosed().subscribe(result => {
        if (result === Constant.RESULT_CLOSE_DIALOG.CONFIRM) {
          for (let i = 0; i < this.list.length; i++) {
            // this.service.updateOrderDetail(this.list[i].id,this.list[i]).subscribe({
            //   next: res =>{
            //     check++;
            //     if (check==this.list.length) {
            //       this.toast.success({summary:'Cập nhật đơn thành công', duration:3000});
            //       this.matDialogRef.close('submit');
            //     }
            //   },
            //   error: e=>{
            //     console.log(e);
            //     this.toast.error({summary:'Cập nhật đơn thất bại', duration:3000});
            //   }
            // })
            this.service.updateQuantityOrderDetail(this.list[i].productId,this.list[i].orderId,this.list[i].quantity,this.list[i]).subscribe({
              next: res =>{
                console.log(res);
                check++;
                if (check==this.list.length) {
                  this.toast.success('Cập nhật đơn thành công');
                  this.matDialogRef.close('submit');
                }
              },
              error: e=>{
                console.log(e);
                this.toast.error('Cập nhật đơn thất bại');
                this.matDialogRef.close('submit');
              }
            })
          }
        }
    })

  }

  close(){
    this.matDialogRef.close('cancel');
  }

}
