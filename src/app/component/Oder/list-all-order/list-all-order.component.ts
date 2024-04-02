import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../_service/order-service/order.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OrderInfoComponent } from '../order-info/order-info.component';
import { EditShipNameComponent } from '../edit-ship-name/edit-ship-name.component';
import { EditAddessComponent } from '../edit-addess/edit-addess.component';

@Component({
  selector: 'app-list-all-order',
  templateUrl: './list-all-order.component.html',
  styleUrls: ['./list-all-order.component.css']
})
export class ListAllOrderComponent implements OnInit {

  allOrder!: MatTableDataSource<any>;;
  lengthAllOrder: any;

  selectStatus = new FormControl();

  status: any[] = [
    {
      id: 9,
      content: 'Tất cả'
    },
    {
      id: 0,
      content: 'Chờ xác nhận'
    },
    {
      id: 1,
      content: 'Đang xử lý'
    },
    {
      id: 2,
      content: 'Đang vận chuyển'
    },
    {
      id: 3,
      content: 'Đã giao'
    },
    {
      id: 4,
      content: 'Đã hủy'
    },
  ];
  orderStatus: any[] = [
    {
      id: 9,
      content: 'Tất cả'
    },
    {
      id: 0,
      content: 'Đơn chờ'
    },
    {
      id: 1,
      content: 'Đơn lẻ'
    },
    {
      id: 2,
      content: 'Tại quầy'
    },
    {
      id: 3,
      content: 'Đơn giao'
    },
  ]

  columnsAllOrder: string[] = ['index', 'fullname', 'address', 'grandTotal', 'type' , 'status', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private matdialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllOrder();
  }

  filterStatus(index: any){
    console.log(index);
    if (index == 9) {
      this.getAllOrder();
    }else if (index == 0) {
      this.getAll_choxacnhan();
    }else if (index == 1) {
      this.getAll_DANGXULY();
    }else if (index == 2) {
      this.getAll_DANGVANCHUYEN();
    }else if (index == 3) {
      this.getAll_DAGIAO();
    }else if (index == 4) {
      this.getAll_DAHUY();
    }
  }
  filterOrderStatus(index: any){
    console.log(index);
    if (index == 9) {
      this.getAllOrder();
    }else if (index == 0) {
      this.getByOrderStatus('DONCHO');
    }else if (index == 1) {
      this.getByOrderStatus('DONLE');
    }else if (index == 2) {
      this.getByOrderStatus('TAIQUAY');
    }else if (index == 3) {
      this.getByOrderStatus('DONGIAO');
    }
  }

  getByOrderStatus(status: any){
    this.orderService.filterOrderStatus(status).subscribe(data =>{
      this.allOrder = new MatTableDataSource<any>(data.data);
        this.allOrder.data = data.data;
        // this.allOrder = res.data;
        this.lengthAllOrder = data.data.length;
        console.log(this.lengthAllOrder);
        console.log(this.allOrder.data);
        this.allOrder.paginator = this.paginator;
        this.allOrder.sort = this.sort;
    })
  }

  openOrderInfo(order: any){
    this.matdialog.open(OrderInfoComponent,{
      width: '700px',
      data: order
    }).afterClosed().subscribe(res=>{
      if (res=='submit') {
        this.getAllInit();
      }
    })
  }

  getAllInit(){
    this.getAll_choxacnhan();
    this.getAll_DANGXULY();
    this.getAll_DANGVANCHUYEN();
    this.getAll_DAGIAO();
    this.getAll_DAHUY();
  }

  editAddress(data: any){
    this.matdialog.open(EditAddessComponent,{
      width: '700px',
      data: data
    }).afterClosed().subscribe(res=>{
      if (res=='submit') {
        this.getAllInit();
      }
    })
  }
  editShipName(data: any){
    this.matdialog.open(EditShipNameComponent,{
      width: '700px',
      data: data
    }).afterClosed().subscribe(res=>{
      if (res=='submit') {
        this.getAllInit();
      }
    })
  }

  getAllOrder(){
    this.orderService.getall().subscribe({
      next: res=>{
        console.log(res);

        this.allOrder = new MatTableDataSource<any>(res.data);
        this.allOrder.data = res.data;
        // this.allOrder = res.data;
        this.lengthAllOrder = res.data.length;
        console.log(this.lengthAllOrder);
        console.log(this.allOrder.data);
        this.allOrder.paginator = this.paginator;
        this.allOrder.sort = this.sort;
      }
    })
  }

  getAll_choxacnhan() {
    this.orderService.getAll_CHOXACNHAN().subscribe(data => {
      this.allOrder = new MatTableDataSource<any>(data.data);
        this.allOrder.data = data.data;
        // this.allOrder = res.data;
        this.lengthAllOrder = data.data.length;
        console.log(this.lengthAllOrder);
        console.log(this.allOrder.data);
        this.allOrder.paginator = this.paginator;
        this.allOrder.sort = this.sort;
    })

  }
  getAll_DANGXULY() {
    this.orderService.getAll_DANGXULY().subscribe(data => {
      this.allOrder = new MatTableDataSource<any>(data.data);
        this.allOrder.data = data.data;
        // this.allOrder = res.data;
        this.lengthAllOrder = data.data.length;
        console.log(this.lengthAllOrder);
        console.log(this.allOrder.data);
        this.allOrder.paginator = this.paginator;
        this.allOrder.sort = this.sort;
    })

  }

  getAll_DANGVANCHUYEN() {
    this.orderService.getAll_DANGVANCHUYEN().subscribe(data => {
      this.allOrder = new MatTableDataSource<any>(data.data);
        this.allOrder.data = data.data;
        // this.allOrder = res.data;
        this.lengthAllOrder = data.data.length;
        console.log(this.lengthAllOrder);
        console.log(this.allOrder.data);
        this.allOrder.paginator = this.paginator;
        this.allOrder.sort = this.sort;
    })

  }
  getAll_DAGIAO() {
    this.orderService.getAll_DAGIAO().subscribe(data => {
      this.allOrder = new MatTableDataSource<any>(data.data);
        this.allOrder.data = data.data;
        // this.allOrder = res.data;
        this.lengthAllOrder = data.data.length;
        console.log(this.lengthAllOrder);
        console.log(this.allOrder.data);
        this.allOrder.paginator = this.paginator;
        this.allOrder.sort = this.sort;
    })

  }

  getAll_DAHUY() {
    this.orderService.getAll_DAHUY().subscribe(data => {
      this.allOrder = new MatTableDataSource<any>(data.data);
        this.allOrder.data = data.data;
        // this.allOrder = res.data;
        this.lengthAllOrder = data.data.length;
        console.log(this.lengthAllOrder);
        console.log(this.allOrder.data);
        this.allOrder.paginator = this.paginator;
        this.allOrder.sort = this.sort;
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allOrder.filter = filterValue.trim().toLowerCase();

    if (this.allOrder.paginator) {
      this.allOrder.paginator.firstPage();
    }
  }

}
