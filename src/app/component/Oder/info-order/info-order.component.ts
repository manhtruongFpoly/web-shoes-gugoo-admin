import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../_service/order-service/order.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../_model/Order';

@Component({
  selector: 'app-info-order',
  templateUrl: './info-order.component.html',
  styleUrls: ['./info-order.component.css']
})
export class InfoOrderComponent implements OnInit {

  id!: number;
  order: Order = new Order();
  orderDetail: any[] = [];

  constructor(
    private rest: OrderService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.rest.getOneOrder(this.id).subscribe(response=>{
      this.order = response.data;
    })

    this.rest.getOneOrderDetail(this.id).subscribe(response=>{
      this.orderDetail = response.data;
    })
  }

}
