import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/services/products/product-model';
import { getCart } from 'src/app/utils/utils';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CartComponent implements OnInit {

  // HTML Data
  cart: Product[] = [];
  itemQuantity = 0;
  itemQuantityText = '';
  totalValue = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.calculateItemQuantity();
    this.calculateTotalValue();
  }

  clearCart() {
    sessionStorage.removeItem('cart');
    location.reload();
  }

  loadCart(){
    // Obter o cart do session storage
    let sessionCart = getCart();
    if (sessionCart != null){
      for (let i = 0; i < sessionCart.length; i++) {
        if (sessionCart[i].quantity > 0) {
          this.cart.push(sessionCart[i]);
        }
      }
    }
  }

  calculateItemQuantity(){
    if (this.cart.length > 0){
      for(let i = 0; i<this.cart.length; i++){
        this.itemQuantity = this.itemQuantity + this.cart[i].quantity;
      }
    }

    if (this.itemQuantity > 1) {
      this.itemQuantityText = `${this.itemQuantity} itens adicionados ao carrinho`;
    } else if (this.itemQuantity === 1) {
      this.itemQuantityText = `${this.itemQuantity} item adicionado ao carrinho`;
    } else {
      this.itemQuantityText = `Nenhum item foi adicionado ao carrinho`;
    }
  }

  calculateTotalValue(){
    if (this.cart.length > 0){
      for(let i = 0; i<this.cart.length; i++){
        this.totalValue = this.totalValue + (this.cart[i].value * this.cart[i].quantity);
      }
    }
  }

  open() {
		const modalRef = this.modalService.open(PaymentMethodComponent, { backdropClass: 'transparent-backdrop', centered: true });
	}
}