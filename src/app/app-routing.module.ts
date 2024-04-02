import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './component/public/public.component';
import { LoginComponent } from './component/login/login.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthGuard } from './_helper/auth.guard';
import { ManagementProductComponent } from './component/management-product/management-product.component';
import { BuyOfflineComponent } from './component/Buy-offline/buy-offline/buy-offline.component';
import { ListOrderComponent } from './component/Oder/list-order/list-order.component';
import { ListOrdersComponent } from './component/Oder/list-orders/list-orders.component';
import { InfoOrderComponent } from './component/Oder/info-order/info-order.component';
import { ListAllOrderComponent } from './component/Oder/list-all-order/list-all-order.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '', component: PublicComponent, children: [
    {
      path: 'login',
      component: LoginComponent
    }
  ] },
  {
    path: '', component: AuthenticatedComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'list-management-product', component: ManagementProductComponent, canActivate: [AuthGuard] },
      { path: 'buy-offline', component: BuyOfflineComponent, canActivate: [AuthGuard]},

      { path: 'list-order', component: ListOrderComponent, canActivate: [AuthGuard]},
      { path: 'list-orders', component: ListOrdersComponent, canActivate: [AuthGuard]},
      { path: 'info-order/:id', component: InfoOrderComponent, canActivate: [AuthGuard]},
      { path: 'all-order', component: ListAllOrderComponent, canActivate: [AuthGuard]},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
