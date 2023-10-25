import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProductsMenuComponent } from './components/products-menu/products-menu.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CartComponent } from './components/modals/cart/cart.component';
import { LastOrdersComponent } from './components/last-orders/last-orders.component';
import { CupcakeProductsPipe } from './pipes/products-filter-cupcake';
import { CoffeeProductsPipe } from './pipes/products-filter-coffee';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaymentMethodComponent } from './components/modals/payment-method/payment-method.component';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingPageComponent,
    ProductsMenuComponent,
    LoginComponent,
    ProfileComponent,
    LastOrdersComponent,
    CartComponent,
    CupcakeProductsPipe,
    CoffeeProductsPipe,
    SpinnerComponent,
    PaymentMethodComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    QrCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
