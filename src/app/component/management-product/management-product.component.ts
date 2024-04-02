import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { changeWidthAgCenterColsContainerStyleHasMinWidth } from 'src/app/helpers/utils';
import { ActionProductManageComponent } from './action-product-manage/action-product-manage.component';
import { ProductService } from 'src/app/_service/product-service/product.service';
import { CreateUpdateProductComponent } from './create-update-product/create-update-product.component';
import * as moment from 'moment';
import { EventEmitterService } from 'src/app/_service/event-emitter.service';

@Component({
  selector: 'app-management-product',
  templateUrl: './management-product.component.html',
  styleUrls: ['./management-product.component.scss']
})
export class ManagementProductComponent implements OnInit {

  columnDefs;
  rowData;
  headerHeight = 48
  rowHeight = 94
  gridApi;
  gridColumnApi;
  isShowSearch: boolean = true;

  page;
  pageSize = 10;
  total;
  totalPage;
  currentPage = 1;


  constructor(
    private matDialog: MatDialog,
    private changeDetechtorRef: ChangeDetectorRef,
    private productService: ProductService,
    private eventEmitterService: EventEmitterService
  ) {
    this.rowData = [];
    this.buildColumnDefs();
   }

  ngOnInit() {
    this.searchProduct(1);
    this.eventEmitterService.search.subscribe(data => {
      this.searchProduct(1, data.keySearch);
    });
  }

  buildColumnDefs(){
    this.columnDefs = [
      {
        headerName: 'STT',
        headerTooltip: 'STT',
        lockPosition: true,
        suppressMovable: true,
        field: '',
        minWidth: 60,
        maxWidth: 48,
        headerClass: 'grid-title',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // textAlign: 'center',
          'justify-content': 'center',
        },
        valueGetter: (param) => {
          return param.node.rowIndex + ((this.currentPage - 1) * this.pageSize + 1)
        },
      },
      {
        headerName:  'code',
        headerTooltip: 'code',
        field: 'code',
        suppressMovable: true,
        headerClass: 'grid-title',
        minWidth: 102,
        maxWidth: 120,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'text-align': 'center',
          'cursor': 'pointer',
        },
        tooltipField: 'code',
      },
      {
        headerName:  'Tên sản phẩm',
        headerTooltip: 'Tên sản phẩm',
        field: 'name',
        suppressMovable: true,
        headerClass: 'grid-title',
        minWidth: 200,
        maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'cursor': 'pointer',
        },
        tooltipField: 'name',
      },
      {
        headerName:  'Giá sản phẩm',
        headerTooltip: 'Giá sản phẩm',
        field: 'price',
        suppressMovable: true,
        headerClass: 'grid-title',
        minWidth: 200,
        maxWidth: 200,
        cellClass: 'grid-cell-centered',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'cursor': 'pointer',
        },
        toolTipField: 'price',
      },
      {
        headerName:  'Giá đã giảm',
        headerTooltip: 'Giá đã giảm',
        field: 'priceNew',
        headerClass: 'grid-title center',
        suppressMovable: true,
        minWidth: 200,
        maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'justify-content': 'center',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'cursor': 'pointer',
        },
        tooltipField: 'priceNew',
      },
      {
        headerName: 'ngày tạo',
        headerTooltip: 'ngày tạo',
        field: 'createDate',
        headerClass: 'grid-title center m-l-5 date-custom',
        suppressMovable: true,
        minWidth: 140,
        maxWidth: 100,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'justify-content': 'center',
          top: '0px',
          'margin-top': '-36px',
          'text-align': 'center',
          'white-space': 'break-spaces'
        },
        tooltipValueGetter: (param) => {
          if(param.data.createDate){
            const time = moment(param.data.createDate).format('DD/MM/YYYY hh:mm:ss');
            return time;
          }
        },
        cellRenderer: (param) => {
          var temDiv = document.createElement("div");
          var dateDiv = document.createElement("div");
          var timeDiv = document.createElement("div");
          if (param.value) {
            var date = new Date(param.value);
            dateDiv.innerText = this.formatDate(param.value);
            timeDiv.innerText = moment(date).format("HH:mm:ss");
            temDiv.appendChild(dateDiv);
            temDiv.appendChild(timeDiv);
          } else {
            temDiv.innerText = "-";
          }
          return temDiv;
        },
      },
      {
        headerName: 'ngày cập nhật',
        headerTooltip: 'ngày cập nhật',
        field: 'updateDate',
        headerClass: 'grid-title center m-l-5 date-custom',
        suppressMovable: true,
        minWidth: 140,
        maxWidth: 140,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'justify-content': 'center',
          top: '0px',
          'margin-top': '-36px',
          'text-align': 'center',
          'white-space': 'break-spaces'
        },
        tooltipValueGetter: (param) => {
          if(param.data.updateDate){
            const time = moment(param.data.updateDate).format('DD/MM/YYYY hh:mm:ss');
            return time;
          }
        },
        cellRenderer: (param) => {
          var temDiv = document.createElement("div");
          var dateDiv = document.createElement("div");
          var timeDiv = document.createElement("div");
          if (param.value) {
            var date = new Date(param.value);
            dateDiv.innerText = this.formatDate(param.value);
            timeDiv.innerText = moment(date).format("HH:mm:ss");
            temDiv.appendChild(dateDiv);
            temDiv.appendChild(timeDiv);
          } else {
            temDiv.innerText = "-";
          }
          return temDiv;
        },
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'quantity',
        headerClass: 'grid-title center',
        suppressMovable: true,
        minWidth: 200,
        maxWidth: 200,
        cellStyle: (param) => {
          return {
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            display: 'flex',
            'justify-content': 'center',
            top: '0px',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            overflow: 'hidden',
          };
        },
      },
      {
        headerName: 'discount',
        headerTooltip: 'discount',
        field: 'discount',
        headerClass: 'grid-title center',
        suppressMovable: true,
        minWidth: 200,
        maxWidth: 200,
        cellStyle: (param) => {
          return {
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            display: 'flex',
            'justify-content': 'center',
            top: '0px',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            overflow: 'hidden',
          };
        },
      },
      {
        headerName: 'status',
        headerTooltip: 'status',
        field: 'status',
        headerClass: 'grid-title center',
        suppressMovable: true,
        minWidth: 102,
        maxWidth: 120,
        cellStyle: (param) => {
          return {
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            display: 'flex',
            'justify-content': 'center',
            top: '0px',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            overflow: 'hidden',
          };
        },
      },
      {
        headerName: '',
        field: 'undefined',
        suppressMovable: true,
        cellClass: 'cell-action',
        cellRendererFramework: ActionProductManageComponent,
        minWidth: 48,
        maxWidth: 48,
        cellStyle: {
          transform: 'translateX(10px)',
        },
      },
    ];
  }

  searchProduct(page, keySearch?){
    const data = {
      data: {
        keySearch
      },
      page: page - 1,
      pageSize: this.pageSize
    }

    this.currentPage = page;

    this.productService.searchProduct(data).subscribe((res:any)=>{
      this.rowData = res?.data?.content;

      this.total = res?.data?.totalElements;
      this.totalPage = res?.data?.totalPages;

      if (this.rowData.length === 0) {
        this.gridApi.setDomLayout('normal');
      } else {
        this.gridApi.setDomLayout('autoHeight');
      }

      this.changeDetechtorRef.detectChanges();
    })
  }


  openFormCreate(){
    this.matDialog.open(CreateUpdateProductComponent, {
      // data: data,
      disableClose: false,
      hasBackdrop: true,
      width: '850px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'view-detail-prompt'
    }).afterClosed().subscribe(result => {
      this.ngOnInit();
    })
    
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    changeWidthAgCenterColsContainerStyleHasMinWidth(1160,8);
    this.changeDetechtorRef.detectChanges();
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    changeWidthAgCenterColsContainerStyleHasMinWidth(1160,8);
    this.changeDetechtorRef.detectChanges();
  }

  formatDate(originalDate: string): string {
    const date = new Date(originalDate);
    return `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }
}
