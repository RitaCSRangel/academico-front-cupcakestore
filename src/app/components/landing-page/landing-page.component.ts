import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/services/products/product-model';
import { calculateScore, checkLogin, getCart, setCart, setUser } from 'src/app/utils/utils';
import { HeaderComponent } from '../header/header.component';
import { User } from 'src/app/services/users/user-model';
import { ProductsService } from 'src/app/services/products/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { OrderProduct } from 'src/app/services/orders/order-model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})

export class LandingPageComponent implements OnInit {

  // -------- Atributos --------

  // Recebíveis por vias externas
  @Input() currentPage = '';

  // Controladores
  logged = false;
  cartManipulationInProgress = false;

  // Armazenadores
  products: Product[] = [];

  // -------- Método Construtor --------
  constructor(
    private productsService: ProductsService, // Injection da classe ProductsService para poder chamar os métodos de API definidos nela
    private ordersService: OrdersService
  ) { }

  // -------- Métodos do ciclo de vida do componente --------
  ngOnInit(): void {
    this.loadProducts();
    this.loadLoginFeatures();
  }

  // -------- Métodos da Classe --------

  // Método loadLoginFeatures
  // Este método é responsável por chamar a função definida nos utilitários (utils) de checkLogin para checar se um usuário está logado
  // e, se estiver, ativa remove o botão de "acessar" da barra de navegação. Se não estiver, ativa o botão de acessar da barra de navegação.
  loadLoginFeatures() {

    this.logged = checkLogin();
    if (this.logged) {
      document.getElementById('acessar')?.classList.add('hidden');
      this.logged = true;
    } else {
      document.getElementById('acessar')?.classList.remove('hidden');
      this.logged = false;
    }
  }

  // Método loadProducts
  // Este método é responsável por chamar a função que corresponde ao método GET de obter todos os produtos definido no productsService e aguardar por sua
  // resposta para armazenar o retorno no atributo products desta classe, organizar estes produtos na ordem de maior pro menor score e por fim guardar
  // essa informação no session storage do navegador para que possa ser usada em outras telas sem a necessidade de repetir a chamada da API durante a sessão.
  loadProducts() {
    this.productsService.getAllProducts().subscribe(
      (response: Product[]) => {
        this.products = response;

        // Arrumar do maior pro menor score
        this.products.sort((itemA, itemB) => (itemA.score < itemB.score) ? 1 : (itemA.score > itemB.score) ? -1 : 0);

        // Armazenar na storage session
        calculateScore(this.products, this.ordersService);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // Método addRemoveToCart
  // Este método é responsável por adicionar ou remover itens ao carrinho. Para fazer essa adição ou remoção, ao clicar no botão, o método
  // o id correspondente do produto, que será o mesmo id da ordenação do array de produtos. Logo, o método buscará o item deste id e aumentará
  // a propriedade de quantity. Em seguida, os valores do session storage serão atualizados para que outros locais da aplicação possam ver quanto
  // de cada produto este usuário está adicionando à compra.
  addRemoveToCart(id: number, action: string) {

    //Procurar pelo item clicado nos produtos
    for (let i = 0; i < this.products.length; i++) {

      //Ao encontrar, atualizar a quantidade do produto, atualizar o cart no session storage e encerrar
      if (this.products[i].id === id) {
        if (action === 'add') {
          this.products[i].quantity = this.products[i].quantity + 1;
        } else if (action === 'rem') {
          if (this.products[i].quantity > 0) {
            this.products[i].quantity = this.products[i].quantity - 1;
          } else {
            return;
          }
        } else {
          return;
        }
        setCart(this.products);
        break;
      }
    }
  }

  // Método showAlert
  // Este método mostra um alerta nos botões de adicionar ou remover quando o usuário não está logado na aplicação.
  showAlert(id: string) {
    if (this.logged === false) {
      if (document.getElementById(`cardalert-${id}`)?.classList.contains('invisible')) {
        document.getElementById(`cardalert-${id}`)?.classList.remove('invisible');
        document.getElementById(`cardalert-${id}`)?.classList.add('visible');
      } else {
        document.getElementById(`cardalert-${id}`)?.classList.add('invisible');
        document.getElementById(`cardalert-${id}`)?.classList.remove('visible');
      }
    }
  }

}