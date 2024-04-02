import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CreateUpdateProductComponent } from '../create-update-product/create-update-product.component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ProductService } from 'src/app/_service/product-service/product.service';
import { ManagementProductComponent } from '../management-product.component';

@Component({
  selector: 'app-action-product-manage',
  templateUrl: './action-product-manage.component.html',
  styleUrls: ['./action-product-manage.component.scss']
})
export class ActionProductManageComponent implements OnInit, ICellRendererAngularComp {
  cellValue;
  rowIndex;
  modalRef: BsModalRef;
  
  constructor(
    private matDialog : MatDialog,
    private modalService: BsModalService,
    private toaStr : ToastrService,
    private productService: ProductService,
    private managmentProduct: ManagementProductComponent
  ) { }

  ngOnInit() {
  }

  agInit(params): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  refresh(params) {
    // set value into cell again
    return true
  }

  openModalUpdate(){
    const dataEdit = this.cellValue;
    this.matDialog.open(
      CreateUpdateProductComponent,{
        data: dataEdit,
        width: '850px',
        maxHeight: '80vh',
        panelClass:'list-trans-seller',
        disableClose: false,
        hasBackdrop: true,
        autoFocus: false
      }
    ).afterClosed().subscribe((res) => {
      this.managmentProduct.searchProduct(1);
    });
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'delete-popup-user' })
    );
  }

  deleteProduct(){
    this.productService.deleteProduct(this.cellValue.id).subscribe(res => {
      this.toaStr.success("Xóa sản phẩm thành công!!!");
      this.modalRef.hide();
    });
  }

}
