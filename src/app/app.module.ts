import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { PublicComponent } from './component/public/public.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { PaginationComponent } from './component/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AgGridModule } from 'ag-grid-angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionProductManageComponent } from './component/management-product/action-product-manage/action-product-manage.component';
import { ManagementProductComponent } from './component/management-product/management-product.component';
import { CreateUpdateProductComponent } from './component/management-product/create-update-product/create-update-product.component';
import { BuyOfflineComponent } from './component/Buy-offline/buy-offline/buy-offline.component';
import { AuthInterceptor } from './_helper/auth.interceptor';
import { GhnInterceptor } from './_helper/ghn.interceptor';
import { ModalSearchListProductComponent } from './component/Buy-offline/buy-offline/modal-search-list-product/modal-search-list-product.component';
import { CancelDialogComponent } from './component/Oder/cancel-dialog/cancel-dialog.component';
import { EditAddessComponent } from './component/Oder/edit-addess/edit-addess.component';
import { EditOrderComponent } from './component/Oder/edit-order/edit-order.component';
import { EditShipNameComponent } from './component/Oder/edit-ship-name/edit-ship-name.component';
import { InfoOrderComponent } from './component/Oder/info-order/info-order.component';
import { ListAllOrderComponent } from './component/Oder/list-all-order/list-all-order.component';
import { ListOrderComponent } from './component/Oder/list-order/list-order.component';
import { ListOrdersComponent } from './component/Oder/list-orders/list-orders.component';
import { OrderInfoComponent } from './component/Oder/order-info/order-info.component';

import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';


import { TableModule } from 'primeng/table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { StatisticalComponent } from './component/statistical/statistical.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PublicComponent,


    AuthenticatedComponent,
    DashboardComponent,

    SpinnerComponent,
    PaginationComponent,

    ActionProductManageComponent,
    ManagementProductComponent,
    CreateUpdateProductComponent,

    // BuyOfflineTestComponent,
    BuyOfflineComponent,
    ModalSearchListProductComponent,

    CancelDialogComponent,
    EditAddessComponent,
    EditOrderComponent,
    EditShipNameComponent,
    InfoOrderComponent,
    ListAllOrderComponent,
    ListOrderComponent,
    ListOrdersComponent,
    OrderInfoComponent,
    StatisticalComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgSelectModule,

    MatDialogModule,
    MatCheckboxModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatStepperModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule,
    MatTableModule,

    TableModule,



    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
    }),
    AgGridModule.withComponents([
    ]),
  ],
  providers: [
    ToastrService,
    BsModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GhnInterceptor,
      multi: true,
    },
    BsModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
