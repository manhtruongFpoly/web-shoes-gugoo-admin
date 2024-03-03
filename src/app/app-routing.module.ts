import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './component/public/public.component';
import { LoginComponent } from './component/login/login.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthGuard } from './_helper/auth.guard';
import { ManagementProductComponent } from './component/management-product/management-product.component';


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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
