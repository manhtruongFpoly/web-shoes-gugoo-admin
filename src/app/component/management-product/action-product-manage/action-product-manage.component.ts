import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CreateUpdateProductComponent } from '../create-update-product/create-update-product.component';
import { ICellRendererAngularComp } from 'ag-grid-angular';

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
        maxHeight: '90vh',
        panelClass:'list-trans-seller',
        disableClose: false,
        hasBackdrop: true,
        width: '760px',
        autoFocus: false
      }
    ).afterClosed().subscribe((res) => {
    });
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'delete-popup-user' })
    );
  }

  deleteProduct(){
   
  }

}
