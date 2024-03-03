import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../../_service/category-service/category.service';
import { OrderService } from '../../../_service/order-service/order.service';
import { CartModel } from '../../../_model/CartModel';
import { GhnService } from 'src/app/_service/ghn-service/ghn.service';
import { Delivery } from '../../../_model/DeliveryOrder';
import { data } from 'jquery';
import { OrderTheCounter } from '../../../_model/AtTheCounterOrder';
import { CartService } from 'src/app/_service/cart.service';
import { ProductService } from 'src/app/_service/product-service/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buy-offline-test',
  templateUrl: './buy-offline-test.component.html',
  styleUrls: ['./buy-offline-test.component.css']
})
export class BuyOfflineTestComponent implements OnInit {

  isLoading: boolean = false;

  //phần sản phẩm
  products: any[] = [];
  categories: any[] = [];
  title = '';
  page = 0;
  count = 0;
  pageSize = 6;
  pageSizes = [10, 20, 30];
  idProduct: any;
  //phần sản phẩm

  // phần hóa đơn
  listOrder: any[] = [];
  listOrderPaid: any[] = [];
  idOrder: any;
  delivery: Delivery = new Delivery;
  orderAt: OrderTheCounter = new OrderTheCounter;
  validFormDeliveryOrder!: FormGroup;
  validFormAtTheCounterOrder!: FormGroup;
  validateFormCheckPayment!: FormGroup;
  nameStaff!: any;
  updateDate!: any;
  createDate!: any;
  total!: any;
  doing = false;
  pageOrder = 0;
  countOrder = 0;
  pageSizeOrder = 6;
  // phần hóa đơn

  // phần giỏ hàng
  cart: CartModel = new CartModel();
  carts: CartModel[] = [];
  totalAmount: number = 0;
  quantityCart: number = 0;
  quantity!: number;
  voucher!: string;
  amount!: number;
  code: any;
  value: any;
  //phần giỏ hàng

  //phan api GHN
  provinceName: any;
  districtName: any;
  wardName: any;
  province: any[] = [];
  district: any[] = [];
  ward: any[] = [];

  shippingTotal: any;
  serviceId: any;

  ship: any;
  sdt: any;
  des: any;
  tinh: any;
  quan: any;
  xa: any;
  //phan api GHN

  // trang thai huy
  confirmMessage = '';
  orderId!: number;
  reason: any;
  validFormCancelled!: FormGroup;
  // trang thai huy


  constructor(
    private modalService: NgbModal,
    private restC: CategoryService,
    private restOrder: OrderService,
    private restCart: CartService,
    private restProduct: ProductService,
    private toast: ToastrService,
    private restGhn: GhnService,
  ) { }

  ngOnInit(): void {


    // this.shippingTotal = 0;


    this.getAllCategory();
    this.getAllProduct();
    // this.getAll();

    //phần hóa đơn
    this.getAllPaymentStatusPaid();
    this.getAllPaymentStatus();
    this.getCartByUser();
    this.getSumTotal();

    //phần hóa đơn

    //phanf api GHN
    this.getProvinces();
    //phanf api GHN

    this.validateFormCheckPayment = new FormGroup({
      'check-payment': new FormControl(null, [Validators.required]),
    })

    this.validFormCancelled = new FormGroup({
      'reason': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(200)]),
    });

    this.validFormDeliveryOrder = new FormGroup({
      'fullname': new FormControl(null, [Validators.required]),
      'province': new FormControl(null, [Validators.required]),
      'district': new FormControl(null, [Validators.required]),
      'ward': new FormControl(null, [Validators.required]),
      'phone': new FormControl(null, [Validators.required]),
      'shipping': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required]),
    })

    this.validFormAtTheCounterOrder = new FormGroup({
      'fullname': new FormControl(null, [Validators.required]),
      'province': new FormControl(null, [Validators.required]),
      'district': new FormControl(null, [Validators.required]),
      'ward': new FormControl(null, [Validators.required]),
      'phone': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required]),
    })


  }

  // huy don hang

  confirmUpdateCancelledStatus(confirmDialog: TemplateRef<any>, id: number) {
    this.confirmMessage = `Xác nhận cập nhật ?`;
    this.orderId = id;
    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })
  }

  confirmCancelled() {
    this.restOrder.canceledOrder(this.orderId, this.reason)
      .subscribe(response => {
        this.toast.success('Order cancel successfully');
        console.log(this.reason + "ádjkja");
        this.ngOnInit();
      }, error => {
        this.toast.error('Orders cannot be canceled');
        console.log(error);
        this.ngOnInit();
      });
  }

  //huy don hang



  // phần api giao hang nhanh

  getShipping(districtId: any) {
    const data = {
      "shop_id": 3526682,
      "from_district": 1542, // tu ha dong
      "to_district": districtId
    }



    this.restGhn.getService(data).subscribe(res => {
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

      this.restGhn.getShipping(shippingOrder).subscribe(res => {
        this.shippingTotal = res.data.total;
      })

    })

  }

  getProvinces() {
    this.restGhn.getProvince().subscribe(response => {
      this.province = response.data;
    })
  }

  getDistrict(provinceId: any, provinceName: any) {
    this.restGhn.getDistrict(provinceId).subscribe((res: any) => {
      this.district = res.data;
    })
    this.provinceName = provinceName;
  }

  getWard(districtId: any, districtName: any) {
    this.getShipping(districtId);
    this.restGhn.getWard(districtId).subscribe((res: any) => {
      this.ward = res.data;
    })
    this.districtName = districtName;
  }

  getWardName(wardName: any) {
    this.wardName = wardName;
  }
  // phần api giao hang nhanh


  //phần hóa đơn.
  finishAndAlert(message: string) {
    this.ngOnInit();
  }

  createOrder() {
    this.isLoading = true;
    this.restOrder.createAnOrderAtTheCounter(this.orderAt).subscribe(res => {
      this.toast.success('Tạo Đơn hang thành công');
      this.isLoading = false;
      this.ngOnInit();
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  createDeliveryOrder() {
    this.isLoading = true;
    this.restOrder.createDeliveryOrder(this.delivery).subscribe(res => {
      this.toast.success('Tạo Đơn hang thành công');
      this.isLoading = false;

      this.ngOnInit();
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  getAllPaymentStatus() {
    this.restOrder.getAllPaymentStatus().subscribe(res => {
      this.listOrder = res.data;
      this.nameStaff = res.data[0].nameStaff;
      this.shippingTotal = res.data[0].shipping;
      this.ship = res.data[0].shipping;
      // this.sdt = res.data[0].phone;
      // this.des = res.data[0].phone;
      // this.tinh = res.data[0].phone;
      // this.quan = res.data[0].phone;
      // this.xa = res.data[0].phone;

    })
  }

  getRqeParams(page: number, pageSize: number): any {
    let params: any = {};
    if (page) {
      params[`page`] = this.pageOrder - 1;
    }

    if (pageSize) {
      params[`page-size`] = this.pageSizeOrder;
    }

    return params;
  }

  getAllPaymentStatusPaid() {
    this.restOrder.getAllPaymentStatusPaid().subscribe(res => {
      this.listOrderPaid = res.data;
      // const totalItem = res.pagination.totalItem;
      // this.countOrder = totalItem;
    })
  }

  searchFullnameOrder(even: any): void {
    this.isLoading = true;
    let condition = even.target.value;
    this.restOrder.getAllOrdersAndSearch(condition).subscribe(res => {
      this.isLoading = false;
      this.listOrderPaid = res.data;

      // const totalItem = res.pagination.totalItem;
      // this.countOrder = totalItem;
    })
  }

  // handlePageChangeOrder(event: number) {
  //   this.pageOrder = event;
  //   this.getAllPaymentStatusPaid();
  // }

  confirmCreateOrder(confirmDialog: TemplateRef<any>) {
    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })
  }

  clickReset() {
    this.doing = false;
  }

  getOneOrder(id: any) {
    this.getAllPaymentStatus();
    this.doing = false;
    this.isLoading = true;
    this.restOrder.getOneOrder(id).subscribe(res => {
      this.doing = true;
      this.isLoading = false;
      this.idOrder = res.data.id;
      console.log(res.data.id + "id order");

      this.restOrder.getOneOrder(res.data.id).subscribe(res => {
        this.delivery = res.data;
        this.orderAt = res.data;
        console.log(res.data + "hihi");
      })

    })
  }

  getOneOrderKh(id: any) {
    this.getAllPaymentStatus();
    this.doing = true;
    this.isLoading = true;
    this.restOrder.getOneOrder(id).subscribe(res => {
      this.doing = false;
      this.isLoading = false;
      this.idOrder = res.data.id;
      console.log(res.data.id + "id order");

      this.restOrder.getOneOrder(res.data.id).subscribe(res => {
        this.delivery = res.data;
        this.orderAt = res.data;
        console.log(res.data + "hihi");
      })

    })
  }

  getOneOrderId(id: any) {
    this.isLoading = true;
    this.restOrder.getOneOrder(id).subscribe(res => {
      this.isLoading = false;
      this.idOrder = res.data.id;
      // this.ship = res.data.shipping;
      console.log(res.data.id + "id order");
    })
  }

  // đặt hàng
  checkoutAtTheCounter() {
    this.isLoading = true;
    this.restOrder.checkoutAnOrderAtTheCounter(this.idOrder).subscribe(res => {
      this.ngOnInit();
      this.isLoading = false;
      this.toast.success('Đặt hàng thành công');
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  // cập nhật hóa đơn giao
  updateDeliveryOrders() {
    this.isLoading = true;
    this.restOrder.updateDeliveryOrder(this.delivery.id, this.delivery).subscribe(res => {
      this.isLoading = false;
      this.toast.success('Cập nhật thành công');
      console.log(res.data + "update");
      // this.getOneOrder(this.delivery.id);
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  // cap nhat don hang tai quay
  updateAtTheCounter() {
    {
      this.isLoading = true;
      this.restOrder.updateOrderAtTheCounter(this.delivery.id, this.orderAt).subscribe(res => {
        this.isLoading = false;
        this.toast.success('Cập Nhật thành công');
      }, error => {
        console.log(error);
        this.isLoading = false;
      });
    }
  }

  //phần hóa đơn


  // phần sản phẩm đặt
  addToCart(pro: any) {
    this.isLoading = true;
    this.cart.productId = pro.id;
    console.log(pro.id);
    this.restCart.createCart(this.cart)
      .subscribe(data => {
        this.isLoading = false;
        this.cart = data.data;
        this.toast.success('Thêm sản phẩm ' + pro.name + ' thành công!');
        this.ngOnInit();

      });
  }


  getCartByUser() {
    this.restCart.getAllCartByUser()
      .subscribe(data => {
        this.carts = data.data;
      });
  }

  getSumTotal() {
    this.isLoading = true;
    this.restCart.getSumTotal()
      .subscribe(data => {
        this.isLoading = false;
        this.totalAmount = data.data.totalAmount;
        this.quantityCart = data.data.quantityCart;
        this.total = this.totalAmount + this.ship;
      });
  }

  plusQuantityCart(cart: any) {
    cart.quantity++;
    this.restProduct.getOne(cart.product_id)
      .subscribe(data => {
        if (cart.quantity > data.data.quantity) {
          this.toast.warning('Số lượng vượt quá số lượng trong kho!');
          this.ngOnInit();
        } else {
          this.restCart.updateCart(cart.product_id, cart)
            .subscribe(data => {
              this.ngOnInit();
            });
        }
      });

  }

  minusQuantityCart(cart: any) {
    cart.quantity--;
    if (cart.quantity < 1) {
      this.toast.warning('Số lượng sản phẩm phải lớn hơn 0!');
      this.ngOnInit();
    } else {
      this.restCart.updateCart(cart.product_id, cart)
        .subscribe(data => {
          this.ngOnInit();
        });
    }
  }

  updateCart(cart: any) {
    if (cart.quantity < 1) {
      this.toast.warning('Số lượng sản phẩm phải lớn hơn 0!');
      this.ngOnInit();
    } else if (cart.quantity >= 'a' && cart.quantity <= 'z' || cart.quantity >= 'A' && cart.quantity <= 'Z') {
      this.toast.warning('Số lượng sản phẩm phải là số!');
      this.ngOnInit();
    } else {
      this.restProduct.getOne(cart.product_id)
        .subscribe(data => {
          if (cart.quantity > data.data.quantity) {
            this.toast.warning('Số lượng vượt quá số lượng trong kho!');
            this.ngOnInit();
          } else {
            this.restCart.updateCart(cart.product_id, cart)
              .subscribe(data => {
                this.ngOnInit();
              });
          }
        });
    }
  }

  deleteCart(cart: any) {
    // const swalWithBootstrapButtons = Swal.mixin({
    //   customClass: {
    //     confirmButton: 'btn btn-success',
    //     cancelButton: 'btn btn-danger'
    //   },
    //   buttonsStyling: false
    // })

    // swalWithBootstrapButtons.fire({
    //   title: 'Xóa Khỏi Giỏ Hàng',
    //   text: "Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng không?",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Chắc Chắn!',
    //   cancelButtonText: 'Không',
    //   reverseButtons: true
    // }).then((result) => {
    //   if (result.isConfirmed) {
        this.restCart.deleteCart(cart.product_id)
          .subscribe(data => {
            this.toast.success('Xóa sản phẩm khỏi giỏ hàng thành công!');
            this.ngOnInit();
          });
    //     swalWithBootstrapButtons.fire('Deleted!', 'Xóa Sản Phẩm Khỏi Giỏ Hàng Thành Công', 'success')
    //   }
    // })
  }
  // phần sản phẩm đặt





  // phần sản phẩm
  getRequestParams(searchName: string, page: number, pageSize: number): any {
    let params: any = {};

    if (searchName) {
      params[`name`] = searchName;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`page-size`] = pageSize;
    }

    return params;
  }
  getAllCategory() {
    this.isLoading = true;
    this.restC.getAllCategory(0, 999).subscribe(data => {
      this.isLoading = false;
      this.categories = data.data;
    })
  }

  getAllProduct() {
    this.isLoading = true;
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    // this.restProduct.getAllProductAndSearch(params).subscribe(data => {
    //   this.isLoading = false;
    //   const totalItem = data.pagination.totalItem;
    //   this.products = data.data;
    //   this.count = totalItem;
    //   // console.log(data);
    // },
    //   error => {
    //     console.log(error);
    //   });
    this.restProduct.getAllProduct(0,10).subscribe(data => {
      this.isLoading = false;
      const totalItem = data.pagination.totalItem;
      this.products = data.data;
      this.count = totalItem;
      // console.log(data);
    },
      error => {
        console.log(error);
      });
  }

  handlePageChange(event: number) {
    this.page = event;
    this.getAllProduct();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 0;
    this.getAllProduct();
  }

  searchTitle(even: any): void {
    this.isLoading = true;
    let condition = even.target.value;
    this.restProduct.getAllProductsAndSearch(condition, 0, 10).subscribe(res => {
      this.isLoading = false;
      this.products = res.data;
      const totalItem = res.pagination.totalItem;
      this.count = totalItem;
    })
  }

  filter(e: any) {
    this.isLoading = true;
    let condition = e.target.value;

    if (condition) {
      this.restProduct.getAllProduct_byCate(condition, 0, 50).subscribe(data => {
        this.isLoading = false;
        const totalItem = data.pagination.totalItem;
        this.products = data.data;
        this.count = totalItem;
        console.log(data);
      })
    }

  }

  filterByIdProduct(e: any) {
    let condition = e.target.value;
    if (condition) {
      this.restProduct.getProduct_byIdProduct(condition, 0, 50).subscribe(data => {
        const totalItem = data.pagination.totalItem;
        this.products = data.data;
        this.count = totalItem;
        console.log(data);
      })
    } else {
      this.getAllProduct();
    }
  }

  // phần sản phẩm


}
