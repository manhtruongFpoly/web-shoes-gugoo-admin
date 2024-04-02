import { ChangeDetectorRef, Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { Delivery } from '../../../_model/DeliveryOrder';
import { OrderTheCounter } from '../../../_model/AtTheCounterOrder';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CartModel } from '../../../_model/CartModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../../_service/category-service/category.service';
import { OrderService } from '../../../_service/order-service/order.service';
import { GhnService } from '../../../_service/ghn-service/ghn.service';
import { ExportOrderServiceService } from '../../../_service/export-service/export-order-service.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TokenStorageService } from '../../../_service/token-storage-service/token-storage.service';
import { CartService } from 'src/app/_service/cart.service';
import { ProductService } from 'src/app/_service/product-service/product.service';
import { ToastrService } from 'ngx-toastr';
import { ValidateInput } from 'src/app/_model/validate-input.model';
import { ModalSearchListProductComponent } from './modal-search-list-product/modal-search-list-product.component';

@Component({
  selector: 'app-buy-offline',
  templateUrl: './buy-offline.component.html',
  styleUrls: ['./buy-offline.component.scss']
})
export class BuyOfflineComponent implements OnInit {

  page;
  pageSize = 10;
  total;
  totalPage;
  currentPage = 1;

  //phần sản phẩm
  products: any[] = [];
  // productIamges: ProductImages = new ProductImages();
  // categories: any[] = [];
  title = '';
  // page = 0;
  // count = 0;
  // pageSize = 6;
  // pageSizes = [10, 20, 30];
  codeProduct: any;
  message: any;
  resetFilterByCode: any;
  quantityProduct: any;


  //phần sản phẩm

  isLoading: boolean = false;

  // phần hóa đơn
  listOrder: any[] = [];
  // listOrderPaid: any[] = [];
  idOrder: any;
  delivery: Delivery = new Delivery;
  orderAt: OrderTheCounter = new OrderTheCounter;
  validFormDeliveryOrder!: FormGroup;
  validFormAtTheCounterOrder!: FormGroup;
  validateFormCheckPayment!: FormGroup;
  nameStaff!: any;
  updateDate!: any;
  createDate!: any;
  doing = false;
  isDoing = false;
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
  provinceId: any;
  districtName: any;
  wardName: any;
  province: any[] = [];
  district: any[] = [];
  ward: any[] = [];

  shippingTotal: any;
  serviceId: any;
  addressName: any;

  ship: any;
  sdt: any;
  nameKh: any;
  des: any;
  tinh: any;
  quan: any;
  xa: any;
  //phan api GHN

  // trang thai huy
  orderId!: number;
  // trang thai huy


  // order detail
  orderDetails: any[] = [];
  // order detail


  validProvince:ValidateInput = new ValidateInput();
  validDistrict:ValidateInput = new ValidateInput();
  validWard:ValidateInput = new ValidateInput();

  isDeliveryOrder: boolean = false;

  constructor(

    private modalService: NgbModal,
    private restC: CategoryService,
    private restOrder: OrderService,
    private restCart: CartService,
    private restProduct: ProductService,
    private toast: ToastrService,
    private restGhn: GhnService,
    // private restImages: ImageApiService,
    private restExport: ExportOrderServiceService,
    private tokenStorageService: TokenStorageService,
    private changeDetechtorRef: ChangeDetectorRef,
    private matDialog: MatDialog,
  ) {
   }

  ngOnInit() {

    this.getOrderDetails();

    // this.getAllProduct();
    // this.getAll();

    //phần hóa đơn

    // this.getAllPaymentStatusPaid();
    this.getAllPaymentStatus();
    // this.getCartByUser();
    // this.getSumTotal();


    //phần hóa đơn

    //phanf api GHN
    this.getProvinces();
    //phanf api GHN

    // this.validateFormCheckPayment = new FormGroup({
    //   'check-payment': new FormControl(null, [Validators.required]),
    // })

    // this.validFormDeliveryOrder = new FormGroup({
    //   'fullname': new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]),
    //   'province': new FormControl(null, [Validators.required]),
    //   'district': new FormControl(null, [Validators.required]),
    //   'ward': new FormControl(null, [Validators.required]),
    //   'phone': new FormControl(null, [Validators.required, Validators.pattern("(\\+84|0)([0-9]{9}|[0-9]{10})")]),
    //   'shipping': new FormControl(null),
    //   'description': new FormControl(null),
    // })

    // this.validFormAtTheCounterOrder = new FormGroup({
    //   'fullname': new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]),
    //   'province': new FormControl(null, [Validators.required]),
    //   'district': new FormControl(null, [Validators.required]),
    //   'ward': new FormControl(null, [Validators.required]),
    //   // 'address': new FormControl(null),
    //   'phone': new FormControl(null, [Validators.required, Validators.pattern("(\\+84|0)([0-9]{9}|[0-9]{10})")]),
    //   'description': new FormControl(null),
    // })
  }

  setDeliveryOrder(type){
    if(type == 0){
      this.isDeliveryOrder = false;
      return;
    }
    if(type == 1){
      this.isDeliveryOrder = true;
      return;
    }
    if(type == 2){
      this.isDeliveryOrder = false;
      return;
    }
  }

  // phần api giao hang nhanh

  getShipping(districtId: any) {
    const data = {
      "shop_id": 3526682,
      "from_district": 1542, // tu ha dong
      "to_district": districtId
    }

    this.restGhn.getService(data).subscribe(res => {
      this.serviceId = res.data[0].service_id;

      const shippingOrder = {
        "service_id": this.serviceId,
        "insurance_value": this.totalAmount,
        "from_district_id": 3440,
        "to_district_id": data.to_district,
        "to_ward_code": this.wardCode,
        "weight": 1000
      }

      this.restGhn.getShipping(shippingOrder).subscribe(res => {
        this.shippingTotal = res.data.total;
      })
    })
  }

  revoveInvalid(result){
    result.done = true
  }

  getProvinces() {
    this.restGhn.getProvince().subscribe(response => {
      this.province = response.data;
      console.log(response.data)
    })
  }

  getDistrict(event) {
    console.log(event);
    this.provinceName = event.ProvinceName;
    this.orderAt.province = this.provinceName;
    this.restGhn.getDistrict(event.ProvinceID).subscribe(response => {
      this.district = response.data;
      console.log(response.data);
    })
    this.provinceId = event.ProvinceID;
  }

  districtID:any;
  wardCode;
  getWard(event) {
    console.log(event);
    this.districtName = event.DistrictName;
    this.orderAt.district = event.DistrictName;
    this.districtID = event.DistrictID;
    this.restGhn.getWard(event.DistrictID).subscribe(response => {
      this.ward = response.data;
      console.log(this.wardCode);
    })
  }

  selectWard(event){
    this.wardName = event.WardName
    this.wardCode = event.WardCode
    this.orderAt.ward = event.WardName
    console.log(this.districtID);
    this.getShipping(this.districtID);
    this.addressName = this.wardName + ', ' + this.districtName + ', ' + this.provinceName;
    console.log(this.addressName);
  }

  // getWardName(wardName: any) {
  //   this.wardName = wardName;
  //   this.addressName = this.wardName + ', ' + this.districtName + ', ' + this.provinceName;
  // }
  // phần api giao hang nhanh

  //phần hóa đơn.
  finishAndAlert(message: string) {
    this.ngOnInit();
  }

  // tạo đơn hàng tại quầy
  createOrder() {
    // this.validFormDeliveryOrder.markAllAsTouched();
    // if (this.validFormDeliveryOrder.getRawValue().provinceId === -1 ||
    //     this.validFormDeliveryOrder.getRawValue().districtId === -1 ||
    //     this.validFormDeliveryOrder.getRawValue().wardId === -1
    // ) {
    //   // this.toast.warning("Vui lòng chọn đầy đủ thông tin !")
    //   return;
    // }
    // this.validFormDeliveryOrder.patchValue({
    //   wardName: this.wardName,
    //   districtName: this.districtName,
    //   provinceName: this.provinceName
    // })
    this.isLoading = true;
    this.orderAt.address = this.addressName;
    console.log(this.orderAt.address + "test 01");
    this.restOrder.createAnOrderAtTheCounter(this.orderAt).subscribe(res => {
      this.toast.success('Tạo Đơn hang thành công');
      this.isLoading = false;
      this.orderAt = res.data;
      this.getAllPaymentStatus();

      // this.ngOnInit();
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  // tạo hóa đơn giao
  createDeliveryOrder() {
    this.isLoading = true;

    this.delivery.address = this.addressName;
    this.delivery.shipping = this.shippingTotal;
    console.log(this.delivery.address + "test address");
    console.log(this.delivery.shipping + "test ship");
    this.restOrder.createDeliveryOrder(this.delivery).subscribe(res => {
      this.toast.success('Tạo Đơn hang thành công');
      this.isLoading = false;
      this.delivery = res.data;
      this.getAllPaymentStatus();
    }, error => {
      console.log(error);
      this.isLoading = false;
      this.toast.error('Tạo đơn hàng thất bại');
    });
  }


  getAllPaymentStatus() {
    this.restOrder.getAllPaymentStatus().subscribe(res => {
      this.listOrder = res.data;

      // this.nameStaff = res.data[0].nameStaff;
      // this.shippingTotal = res.data[0].shipping;
      // this.ship = res.data[0].shipping;

      // this.orderAt = res.data[0];

      // this.sdt = res.data[0].phone;
      // this.nameKh = res.data[0].fullname;
      // this.des = res.data[0].description;
      // this.tinh = res.data[0].province;
      // this.quan = res.data[0].district;
      // this.xa = res.data[0].ward;

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

  // getAllPaymentStatusPaid() {
  //   this.restOrder.getAllPaymentStatusPaid().subscribe(res => {
  //     this.listOrderPaid = res.data;
  //     // const totalItem = res.pagination.totalItem;
  //     // this.countOrder = totalItem;
  //   })
  // }

  searchFullnameOrder(even: any): void {
    this.isLoading = true;
    let condition = even.target.value;
    this.restOrder.getAllOrdersAndSearch(condition).subscribe(res => {
      this.isLoading = false;
      this.delivery = res.data[0];
      this.orderAt = res.data[0];
      this.toast.success('Tìm thấy một khách hàng trước đó !');
    }, error => {
      this.toast.success('Khách hàng mới !');
      this.orderAt
      this.isLoading = false;
    });
  }

  // handlePageChangeOrder(event: number) {
  //   this.pageOrder = event;
  //   this.getAllPaymentStatusPaid();
  // }

  // confirmAddProduct(confirmDialog: TemplateRef<any>) {
  //   this.modalService.open(confirmDialog,
  //     { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
  //     }).catch((err) => {

  //     })
  // }

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
      this.shippingTotal = res.data.shipping;
      console.log(res.data.id + "id order");

      this.tokenStorageService.set('id_order', res.data.id)

      this.restOrder.getOneOrder(res.data.id).subscribe(res => {
        this.delivery = res.data;
        this.orderAt = res.data;
        this.sumPriceOrderDetail();

        console.log(res.data + "hihi");
      })

      this.restOrder.getOneOrderDetail(res.data.id).subscribe(res => {
        this.orderDetails = res.data;
      })
    })
  }

  validateNameSection: boolean[] = [];
  clickIndexButton(index){
    this.validateNameSection.fill(false);
    this.validateNameSection[index] = true;
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

  // tạo đơn hang lẻ
  createRetailOrder() {
    this.isLoading = true;
    this.restOrder.createRetailOrder(this.delivery.id).subscribe(res => {
      this.toast.success('Tạo Đơn hang thành công');
      this.isLoading = false;
      this.getAllPaymentStatus();
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }


  confirmCheckoutAtTheCounter(confirmDialog: TemplateRef<any>,){
    this.modalService.open(confirmDialog,
      { ariaDescribedBy: 'modal-basic-title' }).result.then((result) => {
      }).catch((err) => {

      })
  }

  // đặt hàng
  checkoutAtTheCounter() {
    this.isLoading = true;
    this.restOrder.checkoutAnOrderAtTheCounter(this.idOrder).subscribe(res => {
      this.isLoading = false;
      this.toast.success('Đặt hàng thành công');

      this.clickReset();
      this.restExport.exportOrder(this.idOrder).subscribe(response =>{
        console.log("export order success");
      })
     this.ngOnInit();
    }, error => {
      console.log(error + 'hah');
      if (error.success == false) {
        this.isLoading = false;
        this.toast.error(error.message)
      }
      this.isLoading = false;
      this.toast.error('Bạn chưa chọn san pham');

      // console.log(error);
      // this.isLoading = false;
      // if (error == false) {
      //   return this.toast.error({ summary: 'Bạn chưa chọn san pham' });
      // }
      // this.toast.error({ summary: 'Bạn chưa chọn hóa đơn thanh toán' });
    });
  }

  // cập nhật hóa đơn giao
  updateDeliveryOrders() {
    this.isLoading = true;
    this.delivery.address = this.addressName;
    this.delivery.shipping = this.shippingTotal;
    this.restOrder.updateDeliveryOrder(this.delivery.id, this.delivery).subscribe(res => {
      this.isLoading = false;
      this.toast.success('Cập nhật thành công');
      console.log(res.data + "update");
      // this.getOneOrder(this.delivery.id);
      this.getAllPaymentStatus();
      this.sumPriceOrderDetail();
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }


  // tạo đơn hàng chở
  createO() {
    this.isLoading = true;
    this.restOrder.createO().subscribe((res: any) => {
      this.isLoading = false;
      this.toast.success('Tạo đơn hàng chờ thành công');
      this.getAllPaymentStatus();
      // this.sumPriceOrderDetail();
    }, error => {
      console.log(error);
      this.isLoading = false;
      this.toast.error('Chỉ được tạo tối đa 10 đơn hàng chờ');
    });
  }

  // cap nhat don hang tai quay
  updateAtTheCounter() {
    this.delivery.address = this.addressName;
    this.isLoading = true;

    console.log(this.orderAt);
    console.log(this.delivery.id);

    this.restOrder.updateOrderAtTheCounter(this.delivery.id, this.orderAt).subscribe(res => {
      this.isLoading = false;
      this.toast.success('Cập Nhật thành công');
      this.getAllPaymentStatus();
    }, error => {
      console.log(error);
      this.isLoading = false;
    });

  }

  //phần hóa đơn

  // phần sản phẩm đặt


  createOrderDetail(itemProduct) {
    this.isLoading = true;

    this.validateAddTocart();
    if(this.checkValidateColor){
      return
    }
    if(this.checkValidateSize){
      return
    }

    console.log(this.tokenStorageService.get('id_pro'));
    const data = {
      idOrder: this.delivery.id,
      id: itemProduct.id,
      sizeName: this.selectSizeName,
      colorName: this.selectColorName
    }

    // this.restOrder.createOrderDetail(this.delivery.id, this.tokenStorageService.get('id_pro')).subscribe((res: any) => {
    this.restOrder.createOrderDetail(data).subscribe((res: any) => {
      this.isLoading = false;
      this.toast.success('Thêm sản phẩm thành công');
      this.getOrderDetails();
      this.sumPriceOrderDetail();
      this.resetFilterByCode = '';

    }, error => {
      console.log(error);
      this.toast.error('Thêm sản phẩm thất bại');
      this.isLoading = false;
      this.resetFilterByCode = '';
    });
  }

  checkValidateSize = false;
  checkValidateColor = false;
  validateAddTocart(){
    console.log(this.selectColorName);
    if(this.selectColorName === null || this.selectColorName === undefined){
      this.toast.warning('Bạn chưa chọn màu cho sản phẩm',);
      this.checkValidateColor = true;
    }

    if(this.selectSizeName == null || this.selectSizeName == undefined){
      this.toast.warning('Bạn chưa chọn size sản phẩm',);
      this.checkValidateSize = true;
    }
  }

  deleteOrderDetail(idO: any) {
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
        this.restOrder.deleteOrderDetail(idO)
          .subscribe(data => {
            this.toast.success('Xóa sản phẩm khỏi giỏ hàng thành công!');
            this.getOrderDetails();
            this.sumPriceOrderDetail();
          });
    //     swalWithBootstrapButtons.fire('Deleted!', 'Xóa Sản Phẩm Khỏi Giỏ Hàng Thành Công', 'success')
    //   }
    // })
  }

  updateQuantity(idPro: any, idOr: any, quantity: any) {
    this.isLoading = true;

    if (quantity < 1) {
      this.isLoading = false;
      this.toast.warning('Số lượng sản phẩm phải lớn hơn 0!');
      this.getOrderDetails();
      this.sumPriceOrderDetail();
    } else if (quantity >= 'a' && quantity <= 'z' || quantity >= 'A' && quantity <= 'Z') {
      this.isLoading = false;
      this.toast.warning('Số lượng sản phẩm phải là số!');
      this.getOrderDetails();
      this.sumPriceOrderDetail();
    } else {

      this.restProduct.getOne(idPro).subscribe(res => {
        if (quantity > res.data.quantity) {
          this.isLoading = false;
          this.toast.warning('Số lượng vượt quá số lượng trong kho!');
          this.getOrderDetails();
          this.sumPriceOrderDetail();
        } else {
          this.restOrder.updateQuantitys(idPro, idOr, quantity).subscribe(res => {
            this.isLoading = false;
            this.toast.success('Cập nhật thành công!');
            this.getOrderDetails();
            this.sumPriceOrderDetail();
          });
        }
      });
    }
  }


  getOrderDetails() {
    this.restOrder.getOneOrderDetail(this.tokenStorageService.get('id_order')).subscribe(res => {
      this.orderDetails = res.data;
      console.log(res.data + 'kakakakakaka');
    })
  }

  sumPriceOrderDetail() {
    this.restOrder.sumPriceOrderDetail(this.tokenStorageService.get('id_order')).subscribe((res: any) => {
      this.totalAmount = res.data.totalAmount;
      this.ship = res.data.shipping;
      this.total = this.totalAmount + this.ship;
      console.log(this.totalAmount + 'hahahahaha');
    })
  }

  minusQuantity(idPro: any, idOr: any, quantity: any) {
    quantity--;
    if (quantity < 1) {
      this.toast.warning('Số lượng sản phẩm phải lớn hơn 0!');
      this.getOrderDetails();
      this.sumPriceOrderDetail();
      this.isLoading = false;
    } else {
      this.restOrder.updateQuantitys(idPro, idOr, quantity).subscribe(res => {
        this.isLoading = false;
        this.toast.success('Cập nhật thành công!');
        this.getOrderDetails();
        this.sumPriceOrderDetail();
      });
    }
  }

  plusQuantity(idPro: any, idOr: any, quantity: any) {
    quantity++;
    this.restProduct.getOne(idPro)
      .subscribe(data => {
        if (quantity > data.data.quantity) {
          this.isLoading = false;
          this.toast.warning('Số lượng vượt quá số lượng trong kho!');
          this.getOrderDetails();
          this.sumPriceOrderDetail();

        } else {
          this.restOrder.updateQuantitys(idPro, idOr, quantity).subscribe(res => {
            this.isLoading = false;
            this.toast.success('Cập nhật thành công!');
            this.getOrderDetails();
            this.sumPriceOrderDetail();
          });
        }
      });
    this.isLoading = false;
  }


  // sumPriceOrderDet() {
  //   this.restOrder.sumPriceOrderDetail(this.tokenStorageService.get('id_order')).subscribe((res: any) => {
  //     this.totalAmount = res.data.totalAmount;
  //     console.log(this.totalAmount + 'hahahahaha');
  //   })
  // }



  // addToCart(pro: any) {
  //   this.isLoading = true;
  //   this.cart.productId = pro.id;
  //   console.log(pro.id);
  //   this.restCart.createCart(this.cart)
  //     .subscribe(data => {
  //       this.isLoading = false;
  //       this.cart = data.data;
  //       this.toast.success({ summary: 'Thêm sản phẩm thành công!', duration: 3000 });
  //       // this.ngOnInit();
  //       this.resetFilterByCode = '';
  //       this.getCartByUser();
  //       this.getSumTotal();

  //     });
  // }


  // getCartByUser() {
  //   this.restCart.getAllCartByUser()
  //     .subscribe(data => {
  //       this.carts = data.data;
  //     });
  // }

  // getSumTotal() {
  //   this.isLoading = true;
  //   this.restCart.getSumTotal()
  //     .subscribe(data => {
  //       this.isLoading = false;
  //       this.totalAmount = data.data.totalAmount;
  //       this.quantityCart = data.data.quantityCart;
  //       this.total = this.totalAmount + this.ship;
  //     });
  // }

  // plusQuantityCart(cart: any) {
  //   cart.quantity++;
  //   this.restProduct.getOne(cart.product_id)
  //     .subscribe(data => {
  //       if (cart.quantity > data.data.quantity) {
  //         this.toast.warning({ summary: 'Số lượng vượt quá số lượng trong kho!', duration: 3000 });
  //         // this.ngOnInit();
  //         this.getSumTotal();
  //         this.getCartByUser();
  //       } else {
  //         this.restCart.updateCart(cart.product_id, cart)
  //           .subscribe(data => {
  //             this.getSumTotal();
  //             this.getCartByUser();
  //           });
  //       }
  //     });

  // }

  // minusQuantityCart(cart: any) {
  //   cart.quantity--;
  //   if (cart.quantity < 1) {
  //     this.toast.warning({ summary: 'Số lượng sản phẩm phải lớn hơn 0!', duration: 3000 });
  //     this.getSumTotal();
  //     this.getCartByUser();
  //   } else {
  //     this.restCart.updateCart(cart.product_id, cart)
  //       .subscribe(data => {
  //         this.getSumTotal();
  //         this.getCartByUser();
  //       });
  //   }
  // }

  // updateCart(cart: any) {
  //   if (cart.quantity < 1) {
  //     this.toast.warning({ summary: 'Số lượng sản phẩm phải lớn hơn 0!', duration: 3000 });
  //     this.ngOnInit();
  //   } else if (cart.quantity >= 'a' && cart.quantity <= 'z' || cart.quantity >= 'A' && cart.quantity <= 'Z') {
  //     this.toast.warning({ summary: 'Số lượng sản phẩm phải là số!', duration: 3000 });
  //     this.ngOnInit();
  //   } else {
  //     this.restProduct.getOne(cart.product_id)
  //       .subscribe(data => {
  //         if (cart.quantity > data.data.quantity) {
  //           this.toast.warning({ summary: 'Số lượng vượt quá số lượng trong kho!', duration: 3000 });
  //           this.ngOnInit();
  //         } else {
  //           this.restCart.updateCart(cart.product_id, cart)
  //             .subscribe(data => {
  //               this.ngOnInit();
  //             });
  //         }
  //       });
  //   }
  // }



  // deleteCart(cart: any) {
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       confirmButton: 'btn btn-success',
  //       cancelButton: 'btn btn-danger'
  //     },
  //     buttonsStyling: false
  //   })

  //   swalWithBootstrapButtons.fire({
  //     title: 'Xóa Khỏi Giỏ Hàng',
  //     text: "Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng không?",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Chắc Chắn!',
  //     cancelButtonText: 'Không',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.restCart.deleteCart(cart.product_id)
  //         .subscribe(data => {
  //           this.toast.success({ summary: 'Xóa sản phẩm khỏi giỏ hàng thành công!', duration: 3000 });
  //           this.getCartByUser();
  //           this.getSumTotal();
  //         });
  //       swalWithBootstrapButtons.fire('Deleted!', 'Xóa Sản Phẩm Khỏi Giỏ Hàng Thành Công', 'success')
  //     }
  //   })
  // }



  // phần sản phẩm đặt


  // getAllProduct() {
  //   this.isLoading = true;
  //   this.restProduct.getAllProduct(0,10).subscribe(data => {
  //     this.isLoading = false;
  //     const totalItem = data.pagination.totalItem;
  //     this.products = data.data;
  //     // this.count = totalItem;
  //     // console.log(data);
  //   },
  //     error => {
  //       console.log(error);
  //     });
  // }


  searchTitle(even: any): void {
    this.doing = false;
    this.isLoading = true;
    let condition = even.target.value;
    this.restProduct.getAllProductsAndSearch(condition, 0, 10).subscribe(res => {
      if (res.data == null) {
        this.doing = false;
        this.toast.error('Không tìm thấy sản phẩm!')
      } else {
        this.isLoading = false;
        this.products = res.data;
        console.log(this.products);
        // const totalItem = res.pagination.totalItem;
        // this.count = totalItem;
        this.doing = false;
        this.isDoing = true;
        this.resetFilterByCode = '';
      }
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
        // this.count = totalItem;
        console.log(data);
      })
    }

  }

  // tìm kiếm theo mã id product
  filterByIdProduct(e: any) {
    let condition = e.target.value;
    if (condition) {
      this.restProduct.getProduct_byIdProduct(condition, 0, 50).subscribe(data => {

        const totalItem = data.pagination.totalItem;
        this.products = data.data;
        // this.count = totalItem;
        console.log(data);
      },
        error => {
          this.toast.error('Không tìm thấy sản phẩm!')
        });
    } else {
      this.toast.error('Không tìm thấy sản phẩm!')
    }
  }

  modalSearchListProduct(item){
    const data = {
      data: item,
      idOrder: this.delivery.id
    }
    this.matDialog.open(ModalSearchListProductComponent, {
      data: data,
      disableClose: false,
      hasBackdrop: true,
      width: '850px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'view-detail-prompt'
    }).afterClosed().subscribe((res) => {
      this.sumPriceOrderDetail();
      this.getOrderDetails();
    });
  }

  // tìm kiếm theo mã code sản phẩm
  rowData;
  listSize:number[] = [];
  listColor:string[] = [];
  filterByCodeProduct(page) {
    const data = {
      data: {
        code: this.codeProduct
      },
      page: page - 1,
      pageSize: this.pageSize
      
    }
    this.doing = false;
    this.restProduct.searchProduct(data).subscribe((res:any)=>{

      if(res?.data){
        this.rowData = res?.data?.content;
        this.doing = true;
        this.isDoing = true;
        this.listColor = JSON.parse(this.rowData[0].listColors);
        console.log(this.listColor);

        this.listSize = JSON.parse(this.rowData[0].listSizes);
        console.log(this.listSize);

        if(this.rowData){
          this.modalSearchListProduct(this.rowData);
        }


      }else{
        this.doing = false;
        this.isDoing = false;
        this.toast.error('Không tìm thấy sản phẩm!');
      }
      console.log(this.rowData);
    })
    

    // let condition = e.target.value;
    // this.doing = false;
    // if (condition) {
    //   this.restImages.findByMaCodeProduct(condition).subscribe(data => {
    //     if (data.data == null) {
    //       this.doing = false;
    //       this.toast.error({ summary: 'Không tìm thấy sản phẩm!' });
    //       this.resetFilterByCode = '';
    //     } else {sumPriceOrderDetail
    //       this.doing = true;
    //       this.productIamges = data.data;
    //       console.log(data.data.price_new + "product_image");
    //       this.resetFilterByCode = '';
    //       this.tokenStorageService.saveidproduct(data.data.id);
    //     }
    //   },
    //     error => {
    //       this.resetFilterByCode = '';
    //       this.toast.error({ summary: 'Không tìm thấy sản phẩm!' })
    //     });
    // }
  }

  selectedSize;
  selectSizeName: string;
  selectSize(item) {
    this.selectedSize = item.key;
    this.selectSizeName = item.value;
  }

  selectedColor;
  selectColorName: string;
  selectColor(item) {
    this.selectedColor = item.key;
    this.selectColorName = item.value;
  }

}
