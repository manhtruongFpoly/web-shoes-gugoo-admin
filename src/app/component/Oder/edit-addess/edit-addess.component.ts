import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GhnService } from '../../../_service/ghn-service/ghn.service';
import { OrderTheCounter } from '../../../_model/AtTheCounterOrder';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OrderService } from '../../../_service/order-service/order.service';
import { ConfirmDialogComponent } from '../../../_helper/confirm-dialog/confirm-dialog.component';
import { Constant } from '../../../_constant/Constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-addess',
  templateUrl: './edit-addess.component.html',
  styleUrls: ['./edit-addess.component.css']
})
export class EditAddessComponent implements OnInit {
  //address origin
  provinceOrigin: any;
  districtOrigin: any;
  wardOrigin: any;
  addressNameOrigin: any;
  shippingOrigin: any;

  //phan api GHN
  provinceName: any;
  districtName: any;
  wardName: any;
  province: any[] = [];
  district: any[] = [];
  ward: any[] = [];

  shippingTotal: any;
  serviceId: any;
  addressName: any;
  totalAmount: number = 0;
  orderAt: OrderTheCounter = new OrderTheCounter;
  validFormAtTheCounterOrder!: FormGroup;



  formGroup = this.fb.group({
    fullname: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern("(\\+84|0)([0-9]{9}|[0-9]{10})")]],
    description: [''],
  })


  constructor(
    private matDialogRef: MatDialogRef<EditAddessComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private ghnService: GhnService,
    private orderService: OrderService,
    private toast: ToastrService,
    private matDialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    console.log(this.dataDialog);
    this.getProvinces();
    this.validFormAtTheCounterOrder = new FormGroup({
      'province': new FormControl(null),
      'district': new FormControl(null),
      'ward': new FormControl(null),
    });
    this.pathFormGroup();
  }

  // phần api giao hang nhanh

  getShipping(districtId: any) {
    const data = {
      "shop_id": 3526682,
      "from_district": 1542, // tu ha dong
      "to_district": districtId
    }



    this.ghnService.getService(data).subscribe(res => {
      if (res.data.length <= 1) {
        this.serviceId = res.data[0].service_id;
      } else {
        this.serviceId = res.data[1].service_id;
      }

      const shippingOrder = {
        "service_id": this.serviceId,
        "insurance_value": this.totalAmount,
        "from_district_id": 3440,
        "to_district_id": data.to_district,
        "weight": 20
      }

      this.ghnService.getShipping(shippingOrder).subscribe(res => {
        this.shippingTotal = res.data.total;
      })

    })

  }

  getProvinces() {
    this.ghnService.getProvince().subscribe(response => {
      this.province = response.data;
    })
  }

  getDistrict(provinceId: any, provinceName: any) {
    this.ghnService.getDistrict(provinceId).subscribe((res: any) => {
      this.district = res.data;
    })
    this.provinceName = provinceName;
  }

  getWard(districtId: any, districtName: any) {
    this.getShipping(districtId);
    this.ghnService.getWard(districtId).subscribe((res: any) => {
      this.ward = res.data;
    })
    this.districtName = districtName;
  }

  getWardName(wardName: any) {
    this.wardName = wardName;
    this.addressName = this.wardName + ', ' + this.districtName + ', ' + this.provinceName;

  }

  pathFormGroup() {
    this.formGroup.patchValue({ fullname: this.dataDialog.fullname, phone: this.dataDialog.phone, description: this.dataDialog.description });
    this.validFormAtTheCounterOrder.patchValue({province: this.dataDialog.province, district: this.dataDialog.district, ward: this.dataDialog.ward});
    this.provinceOrigin = this.dataDialog.province;
    this.districtOrigin = this.dataDialog.district;
    this.wardOrigin = this.dataDialog.ward;
    this.addressNameOrigin = this.dataDialog.address;
    this.shippingOrigin = this.dataDialog.shipping;
  }

  onSubmit(){
    console.log(this.formGroup.value.fullname);
    // console.log(this.validFormAtTheCounterOrder.value);
    // console.log(this.addressName);
    // console.log(this.shippingTotal);
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
          message: 'Bạn có muốn cập nhật đơn hàng?'
      }
    }).afterClosed().subscribe(result => {
        if (result === Constant.RESULT_CLOSE_DIALOG.CONFIRM) {

          if (this.validFormAtTheCounterOrder.value.province) {
            if (!this.validFormAtTheCounterOrder.value.ward||!this.validFormAtTheCounterOrder.value.district) {
              this.toast.warning('Vui lòng chọn đầy đủ thông tin');
              return;
            }
            var deliveryOrder= {
              shipping: this.shippingTotal,
              fullname: this.formGroup.value.fullname,
              province: this.validFormAtTheCounterOrder.value.province,
              district: this.validFormAtTheCounterOrder.value.district,
              ward: this.validFormAtTheCounterOrder.value.ward,
              address: this.addressName,
              phone: this.formGroup.value.phone,
              description: this.formGroup.value.description
            };
            console.log(deliveryOrder);
            this.updateDeliveryOrder(deliveryOrder);
          }else{
            var deliveryOrder= {
              shipping: this.shippingOrigin,
              fullname: this.formGroup.value.fullname,
              province: this.provinceOrigin,
              district: this.districtOrigin,
              ward: this.wardOrigin,
              address: this.addressNameOrigin,
              phone: this.formGroup.value.phone,
              description: this.formGroup.value.description
            };
            console.log(deliveryOrder);
            this.updateDeliveryOrder(deliveryOrder);
          }






          // this.dataDialog.fullname = this.formGroup.value.fullname;
          // this.dataDialog.phone = this.formGroup.value.phone;
          // this.dataDialog.address = this.addressName;
          // this.dataDialog.province = this.validFormAtTheCounterOrder.value.province;
          // this.dataDialog.district = this.validFormAtTheCounterOrder.value.district;
          // this.dataDialog.ward = this.validFormAtTheCounterOrder.value.ward;
          // this.dataDialog.shipping = this.shippingTotal;
          // this.orderService.updateOrder(this.dataDialog).subscribe({
          //   next: res =>{
          //     console.log(res);
          //     this.toast.success({ summary: 'Cập nhật thông tin thành công', duration: 2000 });
          //     this.matDialogRef.close('submit');
          //   },
          //   error: e =>{
          //     console.log(e);
          //     this.toast.error({ summary: 'Cập nhật thông tin thất bại', duration: 2000 });
          //     this.matDialogRef.close('submit');
          //   }
          // })
        }
    })

    // this.toast.error({ summary: 'Đợi API cập nhật đơn', duration: 2000 });

  }
  updateDeliveryOrder(data: any){
    this.orderService.updateDeliveryOrder(this.dataDialog.id,data).subscribe({
      next: res=>{
        console.log(res);
        this.toast.success(res.message);
        this.matDialogRef.close('submit');
      },
      error: e =>{
        console.log(e);
        this.toast.success('Cập nhật thất bại');
        this.matDialogRef.close('submit');
      }
    })
  }

  close(){
    this.matDialogRef.close('cancel');
  }

}
