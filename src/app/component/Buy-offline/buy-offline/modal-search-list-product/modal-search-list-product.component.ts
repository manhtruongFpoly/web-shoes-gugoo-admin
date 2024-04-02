import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/_service/order-service/order.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { BuyOfflineComponent } from '../buy-offline.component';

@Component({
  selector: 'app-modal-search-list-product',
  templateUrl: './modal-search-list-product.component.html',
  styleUrls: ['./modal-search-list-product.component.scss']
})
export class ModalSearchListProductComponent implements OnInit {

  rowData;
  idOrder;

  listSize:number[] = [];
  listColor:string[] = [];

  selectedColor;
  selectColorName: string;

  selectedSize;
  selectSizeName: string;

  constructor( 
    public dialogRef: MatDialogRef<ModalSearchListProductComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private restOrder: OrderService,
    private toast: ToastrService,
    private tokenStorageService: TokenStorageService,
    ) { 
      this.rowData = data.data;
      this.idOrder = data.idOrder;
      console.log(this.rowData);
      console.log(this.idOrder);
    }

  ngOnInit() {
    this.listProductSearch();
  }


  avatar;
  img
  listProductSearch(){
    this.avatar = this.rowData[0].imgList.split(',');
    this.img = this.avatar[0];

    console.log(this.avatar);
    console.log(this.img);

    this.listColor = JSON.parse(this.rowData[0].listColors);
    console.log(this.listColor);

    this.listSize = JSON.parse(this.rowData[0].listSizes);
    console.log(this.listSize);
  }



  closeModal(){
    this.dialogRef.close({event: 'cancel'});
  }


  selectSize(item) {
    this.selectedSize = item.key;
    this.selectSizeName = item.value;
  }

  selectColor(item) {
    this.selectedColor = item.key;
    this.selectColorName = item.value;
  }

  checkValidateSize = false;
  checkValidateColor = false;
  validateAddTocart(){
    console.log(this.selectColorName);
    if(this.selectColorName === null || this.selectColorName === undefined){
      this.toast.warning('Bạn chưa chọn màu cho sản phẩm',);
      this.checkValidateColor = true;
    }else{
      this.checkValidateColor = false;
    }

    if(this.selectSizeName == null || this.selectSizeName == undefined){
      this.toast.warning('Bạn chưa chọn size sản phẩm',);
      this.checkValidateSize = true;
    }else{
      this.checkValidateSize = false;
    }
  }

  createOrderDetail(itemProduct) {

    this.validateAddTocart();
    if(this.checkValidateColor){
      return
    }
    if(this.checkValidateSize){
      return
    }

    const data = {
      id: itemProduct.id,
      sizeName: this.selectSizeName,
      colorName: this.selectColorName,
      idOrder: this.idOrder,
    }
    // this.restOrder.createOrderDetail(this.delivery.id, this.tokenStorageService.get('id_pro')).subscribe((res: any) => {
    this.restOrder.createOrderDetail(data).subscribe((res: any) => {
      this.toast.success('Thêm sản phẩm thành công');
      // this.getOrderDetails();
      this.sumPriceOrderDetail();
    }, error => {
      console.log(error);
      this.toast.error('Thêm sản phẩm thất bại');
    });
  }

  // getOrderDetails() {
  //   this.restOrder.getOneOrderDetail(this.tokenStorageService.get('id_order')).subscribe(res => {
  //     this.orderDetails = res.data;
  //     console.log(res.data + 'kakakakakaka');
  //   })
  // }

  totalAmount;
  shippingTotal;
  total;
  sumPriceOrderDetail() {
    this.restOrder.sumPriceOrderDetail(this.tokenStorageService.get('id_order')).subscribe((res: any) => {
      this.totalAmount = res.data.totalAmount;
      this.shippingTotal = res.data.shipping;
      this.total = this.totalAmount + this.shippingTotal;
      console.log(this.totalAmount + 'hahahahaha');
    })
  }

}
