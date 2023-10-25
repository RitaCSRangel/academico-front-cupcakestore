import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LastOrdersComponent } from './components/last-orders/last-orders.component';
import { ProductsMenuComponent } from './components/products-menu/products-menu.component';

const routes: Routes = [
  {
    path:'',
    component: LandingPageComponent,
  },
  {
    path:'acesso',
    component: LoginComponent,
  },
  {
    path:'cardapio',
    component: ProductsMenuComponent,
  },
  {
    path:'perfil',
    component: ProfileComponent,
  },
  {
    path:'pedidos',
    component: LastOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
