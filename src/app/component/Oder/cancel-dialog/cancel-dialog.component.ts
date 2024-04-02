import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrimService } from '../../../_service/Trim-Service/trim.service';
import { OrderService } from '../../../_service/order-service/order.service';
import { Constant } from 'src/app/_constant/Constant';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/_helper/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.css']
})
export class CancelDialogComponent implements OnInit {
  cancelOrder = this.fb.group({
    reason: ['', Validators.required]
  })


  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<CancelDialogComponent>,
    // private trimService: TrimService,
    private matDialog: MatDialog,
    private orderService: OrderService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    console.log(this.dataDialog);
  }

  close(){
    this.matDialogRef.close('close');
  }

  checkTrim(){
    // this.trimService.inputTrim(this.cancelOrder,['reason']);
  }

  onSubmit(){
    this.checkTrim();
    this.cancelOrder.markAllAsTouched();
    if (this.cancelOrder.invalid) {
      return;
    }
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
          message: 'Bạn có muốn hủy đơn hàng?'
      }
    }).afterClosed().subscribe(result => {
        if (result === Constant.RESULT_CLOSE_DIALOG.CONFIRM) {
          this.orderService.canceledOrder(this.dataDialog, this.cancelOrder.value.reason).subscribe({
            next: res =>{
              this.toast.success('Hủy đơn thành công');
              this.matDialogRef.close('submit')
            },
            error: e =>{
              console.log(e);
              this.toast.error('Hủy đơn thất bại');
              this.matDialogRef.close('submit')
            }
          })
        }
    })

  }

}
