import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../../_service/order-service/order.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../_helper/confirm-dialog/confirm-dialog.component';
import { Constant } from '../../../_constant/Constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-ship-name',
  templateUrl: './edit-ship-name.component.html',
  styleUrls: ['./edit-ship-name.component.css']
})
export class EditShipNameComponent implements OnInit {

  formGroup = this.fb.group({
    fullname: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern("(\\+84|0)([0-9]{9}|[0-9]{10})")]]
  })

  constructor(
    private matDialogRef: MatDialogRef<EditShipNameComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private orderService: OrderService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    console.log(this.dataDialog);
    this.pathFormGroup();
  }

  pathFormGroup() {
    this.formGroup.patchValue({ fullname: this.dataDialog.fullname, phone: this.dataDialog.phone });
  }

  onSubmit() {

    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
        message: 'Bạn có muốn cập nhật đơn hàng?'
      }
    }).afterClosed().subscribe(result => {
      if (result === Constant.RESULT_CLOSE_DIALOG.CONFIRM) {

        // console.log(this.formGroup.value);
        this.dataDialog.fullname = this.formGroup.value.fullname;
        this.dataDialog.phone = this.formGroup.value.phone;
        console.log(this.dataDialog);
        this.orderService.updateOrder(this.dataDialog).subscribe({
          next: res => {
            console.log(res);
            this.toast.success('Cập nhật thông tin thành công');
            this.matDialogRef.close('submit');
          },
          error: e => {
            console.log(e);
            this.toast.error('Cập nhật thông tin thất bại');
            this.matDialogRef.close('submit');
          }
        })
      }
    })



  }
  close() {
    this.matDialogRef.close('cancel');
  }
}
