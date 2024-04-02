import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ValidateInput } from 'src/app/_model/validate-input.model';
import { ColorService } from 'src/app/_service/color-service/color.service';
import { CommonFunction } from 'src/app/utils/common-function';
import { SizeService } from 'src/app/_service/size-service/size.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProductService } from 'src/app/_service/product-service/product.service';
import { CategoryService } from 'src/app/_service/category-service/category.service';
import { BrandService } from 'src/app/_service/brand-service/brand.service';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-create-update-product',
  templateUrl: './create-update-product.component.html',
  styleUrls: ['./create-update-product.component.scss']
})
export class CreateUpdateProductComponent implements OnInit {

  isUpdate = false;
  isLoading: boolean = false;

  body = {
    id: null,
    code: null,
    name: null,
    price: null,
    discount: null,
    description: null,
    listTransSize: null,
    listTransColor: null,
    categoryId:null,
    brandId: null,
    quantity:null
  }

  validCode:ValidateInput = new ValidateInput();
  validName:ValidateInput = new ValidateInput();
  validPrice:ValidateInput = new ValidateInput();
  validDiscount:ValidateInput = new ValidateInput();
  validImg: ValidateInput = new ValidateInput();
  validDescriptions:ValidateInput = new ValidateInput();
  validQuantity:ValidateInput = new ValidateInput();

  messagerListType: boolean;
  messagerListTypeColor: boolean;

  lstContentBook = [];

  listFileUpload = [];
  listImagePaths = [];
  listImgAvail = [];
  listImgDelete = [];

  listCategory;
  listBrand;

  constructor(
    private changeDetechtorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<CreateUpdateProductComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toaStr : ToastrService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
  ) { 
    if(data){
      this.body.id = this.data.id;
      this.body.code = this.data.code;
      this.body.name = this.data.name;
      this.body.price = this.data.price;
      this.body.discount = this.data.discount;
      this.body.listTransSize = JSON.parse(this.data.listSizes).map(x => x.key);
      this.body.listTransColor = JSON.parse(this.data.listColors).map(x => x.key);
      this.listImgAvail = this.data.imgList?.split(',');
      this.body.brandId = this.data.brandId;
      this.body.categoryId = this.data.categoryId;
      this.body.quantity = this.data.quantity;
    }
  }

  ngOnInit():void {
    this.listSize();
    this.listColor();
    this.getAllBrand();
    this.getAllCategory();
  }


 
  getAllCategory(){
    this.categoryService.getAllCategoryByStatus().subscribe((res:any)=>{
      this.listCategory = res.data;
    })
  }

  getAllBrand(){
    this.brandService.getAllBrand().subscribe((res:any)=>{
      this.listBrand = res.data;
    })
  }

  validate(){
    if(this.body.listTransSize === undefined ||this.body.listTransSize.length === 0){
      this.messagerListType = true;
    }else{
      this.messagerListType = false;
    }
  }

  validateColor(){
    if(this.body.listTransColor === undefined ||this.body.listTransColor.length === 0){
      this.messagerListTypeColor = true;
    }else{
      this.messagerListTypeColor = false;
    }
  }

  listAllSize = [];
  listSize(){
    this.sizeService.getAllSize().subscribe((res:any)=>{
      this.listAllSize = res;
    })
  }

  listAllColor = [];
  listColor(){
    this.colorService.getAllColor().subscribe((res:any)=>{
      this.listAllColor = res;
    })
  }


  submit(){
    this.validateCode();
    this.validateName();
    this.validatePrice();
    // this.validateDiscount();
    // this.validDescription();
    this.validateQuantity();

    if (!this.validCode.done || !this.validName.done || !this.validPrice.done || !this.validQuantity.done || !this.validateImg()) return;

    this.uploadImage();
  }

  validateCode(){
    this.validCode = CommonFunction.validateInputUTF8Space(this.body.code, 50, null,true, true)
  }

  validateName(){
    this.validName = CommonFunction.validateInput(this.body.name, 250, null)
  }

  validateQuantity(){
    this.validQuantity = CommonFunction.validateInput(this.body.quantity, null, null)
  }

  validatePrice(){
    this.validPrice = CommonFunction.validateNumberInput(this.body.price, null, null);
  }

  // validateDiscount(){
  //   this.validDiscount = CommonFunction.validateNumberInput(this.body.discount, null, null)
  // }

  validDescription(){
    this.validDescriptions = CommonFunction.validateInput(this.body.description, 1000, null);
    if (!this.body.description || !this.body.description.trim()) {
      this.validDescriptions.empty = false;
      this.validDescriptions.done = true;
    }
  }

  validateImg() {
    if (this.listFileUpload.length + this.listImgAvail.length == 0) {
      this.validImg.empty = true;
      this.validImg.done = false;
      return false;
    } else {
      this.validImg.empty = false;
      this.validImg.done = true;
      return true;
    }
  }

  closeModal(){
    this.dialogRef.close({event: 'cancel'});
  }

  revoveInvalid(result){
    result.done = true
  }


  sanitizeBlobUrl(blobUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
  }

  deleteFileAvail(imgPath) {
    this.listImgAvail = this.listImgAvail.filter(img => img != imgPath);
    this.listImgDelete.push(imgPath);
  }

  deleteFileUpload(index) {
    this.listImagePaths.splice(index, 1);
  }

  uploadFile(files) {
    for (let k = 0; k < files.target.files.length; k++) {
			let isExists = false;
			this.listFileUpload.forEach((e) => {
				if (
					files.target.files[k].lastModified === e.lastModified && 
					files.target.files[k].name === e.name && 
					files.target.files[k].size === e.size && 
					files.target.files[k].type === e.type
				) {
					isExists = true;
				}
			});

			if (isExists) {
				this.toaStr.error('File đã tồn tại, bạn không được upload file trùng lặp');
				continue;
			} else {
				this.listFileUpload.push(files.target.files[k]);
        this.listImagePaths.push(URL.createObjectURL(files.target.files[k]));
        console.log(this.listFileUpload);
        console.log(this.listImagePaths);
			}
   	}

    if (!this.validateImg()) {
      return;
    }

    files.target.value = null;
  }

  products: any[] = [];

  selectedFiles?: FileList;
  currentFile?: File;
  preview = '';

  onFileChange(event: any) {
    this.preview = '';
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

    uploadImage() {
    this.isLoading = true;
    this.productService.uploadImages({
      data: this.body,
      listFileUpload: this.listFileUpload,
      listImgDelete: this.listImgDelete
    }).subscribe(response => {
      this.isLoading = false;
      this.toaStr.success('Create category successfuly');
      this.isLoading = false;
      console.log(response.data);
    })
  }

}
