import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { Product } from 'src/app/services/products/product-model';
import { ProductsService } from 'src/app/services/products/products.service';
import { User } from 'src/app/services/users/user-model';
import { calculateScore, checkLogin, getCart, setCart } from 'src/app/utils/utils';

@Component({
  selector: 'app-products-menu',
  templateUrl: './products-menu.component.html',
  styleUrls: ['./products-menu.component.scss']
})

export class ProductsMenuComponent implements OnInit {

  // -------- Atributos --------

  // Recebíveis por vias externas
  @Input() cart: Product[] = [];

  // Controladores
  cupcakeTab = true;
  coffeeTab = false;
  logged = false;
  isAdmin = false;
  addFormVisible = false;

  // Armazenadores
  user!: User;

  
  // Inputs
  name = "";
  value = 0;
  type = "cupcake";
  stock = 0;
  image = "";

  // -------- Método Construtor --------
  constructor(
    private productsService: ProductsService, // Injection da classe ProductsService para poder chamar os métodos de API definidos nela
    private ordersService: OrdersService
  ) { }

  // -------- Métodos do ciclo de vida do componente --------
  ngOnInit(): void {
    this.loadCart();
    this.loadLoginFeatures();
    calculateScore(this.cart, this.ordersService);
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
      this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    } else {
      document.getElementById('acessar')?.classList.remove('hidden');
      this.logged = false;
    }
  }

  // Método loadCart
  // Esse método é responsável por obter o carrinho do session storage e carregá-lo como os produtos da página, contendo já as quantidades
  // que o usuário possa ter adicionado durante sua estadia na landing page. Dessa forma, a referência do que o usuário já sinalizou
  // como item comprável não é perdida durante todo o uso da sessão.
  loadCart() {
    // Obter o cart do session storage
    let sessionCart = getCart();
    if (sessionCart != null) {
      const sortedByIdCart = sessionCart.sort(function(a: { id: number; }, b: { id: number; }) { 
        return a.id - b.id;
      });
      this.cart = sortedByIdCart;
    }
  }

  // Método addRemoveToCart
  // Esse método é responsável por controlar os botões de adicionar ou remover itens ao carrinho.
  addRemoveToCart(id: number, action: string) {

    //Procurar pelo item clicado nos produtos
    for (let i = 0; i < this.cart.length; i++) {

      //Ao encontrar, atualizar a quantidade do produto, atualizar o cart no session storage e encerrar
      if (this.cart[i].id === id) {
        if (action === 'add') {
          this.cart[i].quantity = this.cart[i].quantity + 1;
        } else if (action === 'rem') {
          if (this.cart[i].quantity > 0) {
            this.cart[i].quantity = this.cart[i].quantity - 1;
          } else {
            return;
          }
        } else {
          return;
        }
        setCart(this.cart);
        break;
      }
    }
  }

  // Método changeTab
  // Esse método é responsável por controlar a flag que diz qual tab foi clicada e deve ser mostrada em tela.
  changeTab(id: string){
    if (id === 'coffee-tab'){
      document.getElementById('coffee-tab')?.classList.add('active');
      document.getElementById('cupcake-tab')?.classList.remove('active');
      this.coffeeTab = true;
      this.cupcakeTab = false;
    }

    if (id === 'cupcake-tab'){
      document.getElementById('coffee-tab')?.classList.remove('active');
      document.getElementById('cupcake-tab')?.classList.add('active');
      this.coffeeTab = false;
      this.cupcakeTab = true;
    }
  }

  // Método showHideProductForm
  // Esse método mostra ou esconde o formulário de adicionar um novo produto.
  showHideProductForm(){
    this.addFormVisible = !this.addFormVisible;
  }

  // Método removeProduct
  // Esse método é responsável por chamar a API de remover produto.
  removeProduct(index: number){
    this.productsService.deleteProduct(index).subscribe(
      (response: any) => {
        alert("Produto removido!");
        this.productsService.getAllProducts().subscribe(
          (response: any) => {
            setCart(response);
            this.loadCart()
            alert("Carrinho atualizado!");
          },
          (error: HttpErrorResponse) => {
            alert("Não foi possível atualizar o cardápio");
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert("Não foi possível remover o produto");
      }
    );
  }

  // Método addProduct
  // Esse método é responsável por chamar a API de adicionar produto.
  addProduct(){
    const product: Product = {
      id: 0,
      name:this.name,
      value: this.value,
      type: this.type,
      quantity: 0,
      stock: this.stock,
      score: 5,
      image: this.image
    }
    this.productsService.addProduct(product).subscribe(
      (response: any) => {
        alert("Produto adicionado!");
        this.productsService.getAllProducts().subscribe(
          (response: any) => {
            setCart(response);
            this.loadCart()
            alert("Carrinho atualizado!");
          },
          (error: HttpErrorResponse) => {
            alert("Não foi possível atualizar o cardápio");
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert("Não foi possível adicionar o produto");
      }
    );
  }

  // Método getType
  // Esse método é responsável por obter o valor de type do select
  getType(value: string){
    this.type = value;
  }

  // Método getImage
  // Esse método é responsável por obter o valor de image do select
  getImage(value: string){
    this.image = value;
  }
}