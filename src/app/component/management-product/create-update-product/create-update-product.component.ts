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
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-update-product',
  templateUrl: './create-update-product.component.html',
  styleUrls: ['./create-update-product.component.scss']
})
export class CreateUpdateProductComponent implements OnInit {

  isUpdate = false;

  body = {
    id: null,
    code: null,
    name: null,
    price: null,
    description: null,
    listTransSize: null,
    listTransColor: null
  }

  validCode:ValidateInput = new ValidateInput();
  validName:ValidateInput = new ValidateInput();
  validPrice:ValidateInput = new ValidateInput();
  validDiscount:ValidateInput = new ValidateInput();
  validDescriptions:ValidateInput = new ValidateInput();

  messagerListType: boolean;
  messagerListTypeColor: boolean;

  lstContentBook = [];

  listFileUpload = [];
  listImagePaths = [];

  constructor(
    private changeDetechtorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<CreateUpdateProductComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toaStr : ToastrService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private sanitizer: DomSanitizer,
    private productService: ProductService
  ) { }

  ngOnInit():void {
    this.listSize();
    this.listColor();
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

    this.uploadImage();

    // this.productService.createProduct(this.body).subscribe((res)=>{
    //   this.toaStr.success('Them san pham thành công');
    // })

  }

  validateCode(){
    this.validCode = CommonFunction.validateInputUTF8Space(this.body.code, 50, null,true, true)
  }

  validateName(){
    this.validName = CommonFunction.validateInput(this.body.name, 250, null)
  }

  validatePrice(){
    this.validCode = CommonFunction.validateInput(this.body.name, null, null)
  }

  validateDiscount(){
    this.validCode = CommonFunction.validateInput(this.body.name, null, null)
  }

  validDescription(){
    this.validDescriptions = CommonFunction.validateInput(this.body.description, 1000, null)
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

    files.target.value = null;
  }


  isLoading: boolean = true;
  products: any[] = [];

  selectedFiles?: FileList;
  currentFile?: File;
  preview = '';

  imageformAdd = new FormGroup({
    'name': new FormControl('', [Validators.required]),
    'link': new FormControl('', [Validators.required]),
    'product_id': new FormControl(1, [Validators.required]),
    'file': new FormControl('', [Validators.required]),
  })


  get f() {
    return this.imageformAdd.controls;
  }

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
    this.productService.uploadImages(this.listFileUpload).subscribe(response => {
      this.isLoading = false;
      this.toaStr.success('Create category successfuly');
      console.log(response.data);
    })
  }

}