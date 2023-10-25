import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Order, OrderProduct } from 'src/app/services/orders/order-model';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { Product } from 'src/app/services/products/product-model';
import { User } from 'src/app/services/users/user-model';
import { getCart, getUser, setCart } from 'src/app/utils/utils';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PaymentMethodComponent implements OnInit {
  // -------- Atributos --------

  // Controladores
  isPix = false;
  isCard = false;
  loading = false;

  // Inputs
  cardNumber = '';
  cvv = '';
  name = '';
  expireDate = '';
  cpf = '';

  // Armazenadores
  cart: Product[] = [];
  user!: User;
  totalValue = 0;

  // -------- Método Construtor --------
  constructor(
    public activeModal: NgbActiveModal,
    private ordersService: OrdersService
  ) { }

  // -------- Métodos do ciclo de vida do componente --------
  ngOnInit(): void {
    this.loadUser();
    this.loadCart();
    this.calculateTotalValue();
  }

  // -------- Métodos da Classe --------

  // Método loadCart
  // Este método é responsável por obter o carrinho armazenado no session storage. Dessa forma seus dados podem ser carregados
  // na lista de itens que o usuário escolheu (são pegos somente os itens que possuem quantity maior que 0)
  loadCart() {
    // Armazenar na storage session
    const sessionCart = getCart();
    if (sessionCart != null) {
      for (let i = 0; i < sessionCart.length; i++) {
        if (sessionCart[i].quantity > 0) {
          this.cart.push(sessionCart[i]);
        }
      }
    }
  }

  // Método loadUser
  // Este método é responsável por obter os dados do usuário
  loadUser() {
    this.user = getUser();
  }

  // Método payWithPix
  // Este método é mostrar em tela um qr code demonstrativo.
  payWithPix() {
    this.isPix = true;
    this.isCard = false;
  }

  // Método payWithCard
  // Este método é mostrar em tela um formulário de dados de compra
  payWithCard() {
    this.isCard = true;
    this.isPix = false;
  }

  // Método calculateTotalValue
  // Este método é usado para calcular o valor total da compra
  calculateTotalValue() {
    if (this.cart.length > 0) {
      for (let i = 0; i < this.cart.length; i++) {
        this.totalValue = this.totalValue + (this.cart[i].value * this.cart[i].quantity);
      }
    }
  }

  // Método createNewOrder
  // Este método é usado para chamar a API de criar ordem e, uma vez que a ordem é criada, é chamada a
  // API de criar ordem do produto para cada produto adicionado pelo usuário.
  createNewOrder() {
    this.loading = true;
    const order = {
      id: 0,
      userId: this.user.id != null ? this.user.id : 0,
      value: this.totalValue,
      status: 'recebido',
      rated: false
    }

    const found = this.cart.filter((product) => product.quantity > 0).length;
    let contador = 0;

    this.ordersService.addOrder(order).subscribe(
      (response: Order) => {

        this.cart.forEach((item) => {

          if (item.quantity > 0) {
            const orderProduct: OrderProduct = {
              id: 0,
              orderId: response.id != null ? response.id : 0,
              quantity: item.quantity,
              productId: item.id != null ? item.id : 0,
              name: item.name,
              score: 5
            }
            this.ordersService.addOrderProduct(orderProduct).subscribe(
              (response: OrderProduct) => {
                contador++;
                if (found === contador) {
                  const sessionCart = getCart();
                  if (sessionCart != null) {
                    for (let i = 0; i < sessionCart.length; i++) {
                      sessionCart[i].quantity = 0;
                    }
                    setTimeout(() => {
                      sessionStorage.setItem('cart', JSON.stringify(sessionCart))
                      this.activeModal.close();
                      window.location.reload();
                      this.loading = false;
                    }, 2000);
                  }
                }
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              }
            );
          }
        })
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}