import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Order, OrderAndProducts, OrderProduct } from 'src/app/services/orders/order-model';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { Product } from 'src/app/services/products/product-model';
import { ProductsService } from 'src/app/services/products/products.service';
import { User } from 'src/app/services/users/user-model';
import { UsersService } from 'src/app/services/users/users.service';
import { getCart, getUser, setCart } from 'src/app/utils/utils';

@Component({
  selector: 'app-last-orders',
  templateUrl: './last-orders.component.html',
  styleUrls: ['./last-orders.component.scss']
})

export class LastOrdersComponent implements OnInit {

  // -------- Atributos --------

  // Flags
  showContent = false;
  loading = false;

  // Armazenadores
  user!: User;
  ordersAndProducts: OrderAndProducts[] = [];
  menuProducts: Product[] = [];

  // Rating
  ratings: Star[] = [];

  // -------- Método Construtor --------
  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.loadUser();
    // Armazenar na storage session
    const cart = getCart();
    if (cart !== null) {
      this.menuProducts = cart;
    }

    if (this.user.admin === false) {
      this.loadCommonUserOrders();
      this.showContent = true
    } else {
      this.loadAdminUserOrders();
    }
  }

  // -------- Métodos da Classe --------

  // Método loadUserData
  // Este método é responsável por colocar as informações do usuário atual no formulário de perfil
  loadUser() {
    this.user = getUser();
  }

  // Método loadCommonUserOrders
  // Este método é responsável por obter todos os pedidos por usuário (no caso, o usuário logado), 
  // em seguida buscar por todos os produtos daquele pedido e, por fim, montar um array com as informações de
  // pedidos e seus respectivos produtos.
  loadCommonUserOrders() {
    this.ordersService.getAllOrdersFromUser(this.user.id).subscribe(
      (responseOrders: Order[]) => {
        // Encontrou as ordens
        // Para cada ordem
        responseOrders.forEach((order) => {

          // Procura pelos produtos dessa ordem
          this.ordersService.getAllOrderProductsFromOrder(order.id).subscribe(
            (responseOrderProducts: OrderProduct[]) => {

              let element: OrderAndProducts = {
                id: order.id,
                order: order,
                orderProducts: responseOrderProducts,
                products: []
              }

              // Encontrou os produtos da ordem
              // Adiciona os produtos na lista de produtos
              responseOrderProducts.forEach((product) => {
                const found = this.menuProducts.find((menuProduct) => menuProduct.id === product.productId)
                if (found != null) {
                  element.products.push(found)
                }
              })

              this.ordersAndProducts.push(element);
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }

          );
        })
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

  }

  // Método loadAdminUserOrders
  // Este método é responsável por obter todos os pedidos da loja, 
  // em seguida buscar por todos os produtos daquele pedido e, por fim, montar um array com as informações de
  // pedidos e seus respectivos produtos.
  loadAdminUserOrders() {


    this.ordersService.getAllOrders().subscribe(
      (responseOrders: Order[]) => {

        // Encontrou as ordens
        // Para cada ordem
        responseOrders.forEach((order) => {

          // Procura pelos produtos dessa ordem
          this.ordersService.getAllOrderProductsFromOrder(1).subscribe(
            (responseOrderProducts: OrderProduct[]) => {

              let element: OrderAndProducts = {
                id: order.id,
                order: order,
                orderProducts: responseOrderProducts,
                products: []
              }

              // Encontrou os produtos da ordem
              // Adiciona os produtos na lista de produtos
              responseOrderProducts.forEach((product) => {
                const found = this.menuProducts.find((menuProduct) => menuProduct.id === product.productId)
                if (found != null) {
                  element.products.push(found)
                }
              })

              this.ordersAndProducts.push(element);
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }

          );
        })
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // Método loadUserData
  // Este método é responsável por colocar as informações do usuário atual no formulário de perfil
  openCloseInfos(id: number) {
    if (document.getElementById('expanded-' + id.toString())?.classList.contains('hidden')) {
      document.getElementById('expanded-' + id.toString())?.classList.remove('hidden');
      document.getElementById('expanded-' + id.toString())?.classList.add('visible');
    } else {
      document.getElementById('expanded-' + id.toString())?.classList.remove('visible');
      document.getElementById('expanded-' + id.toString())?.classList.add('hidden');
    }
  }

  // Método loadUserData
  // Este método é responsável por colocar as informações do usuário atual no formulário de perfil
  changeOrderStatus(status: string, value: number, userId: number, orderId: number) {
    const order: Order = {
      id: orderId,
      userId: userId,
      value: value,
      status: status,
      rated: false
    }
    this.ordersService.updateOrder(order).subscribe(
      (response: Order) => {
        alert('Status atualizado com sucesso!');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // Método manageStar
  // Este método é disparado ao clicar em alguma estrela e é responsável por verificar se esse produto já recebeu alguma estrela na variável ratings. 
  // Caso já tenha recebido uma avaliação, o método removerá esse elemento antigo e substituirá com um novo elemento contendo as novas estrelas que o 
  // usuário atribuiu para o item. Se o método não encontrar uma avaliação prévia para o item, então essa avaliação é simplesmente alocada no ratings.
  // Por fim, o método passa por cada uma das estrelas até chegar na estrela naquela usuário atribuiu para o item, ativando-as ou desativando-as de 
  // acordo com o booleano activate: 
  // Atribuindo estrelas -> true para ativar as estrelas preenchidas e desativar as estrelas sem preenchimento
  // Removendo estrelas -> false para ativar as estrelas sem preenchimento e desativar as estrelas com preenchimento.
  manageStar(itemIndex: number, starNumber: number, activate: boolean, productId?: number) {

    var star: Star = {
      listIndex: 0,
      productId: 0,
      stars: 0,
      starImages: [
        {
          starNumber: 1,
          active: false
        },
        {
          starNumber: 2,
          active: false
        },
        {
          starNumber: 3,
          active: false
        },
        {
          starNumber: 4,
          active: false
        },
        {
          starNumber: 5,
          active: false
        }
      ]
    };

    const find = this.ratings.find((rating) => rating.productId === productId)
    const filter = this.ratings.filter((rating) => rating.productId === productId)

    if (filter.length > 0) {
      let arrayWithoutElement = this.ratings.filter(function (rating) {
        return rating !== find;
      });
      star.listIndex = itemIndex;
      star.productId = productId != null ? productId : 0;
      star.stars = starNumber;
      for(let i = 0; i < starNumber; i++){
        if(activate === true){
          star.starImages[i].active = true;
        }else{
          if (i < starNumber-1){
            star.starImages[i].active = true;
          }else{
            star.starImages[i].active = false;
          }
        }
       }
      arrayWithoutElement.push(star)
      this.ratings = arrayWithoutElement;
    }
    else {
      star.listIndex = itemIndex;
      star.productId = productId != null ? productId : 0;
      star.stars = starNumber;
      for(let i = 0; i < starNumber; i++){
        if(activate === true){
          star.starImages[i].active = true;
        }else{
          if (i < starNumber-1){
            star.starImages[i].active = true;
          }else{
            star.starImages[i].active = false;
          }
        }
       }
      this.ratings.push(star);
    }

    console.log(this.ratings)
  }

  getStarStatus(productId: number, starNumber: number){
    const found = this.ratings.find((rating) => rating.productId === productId);
    return found?.starImages[starNumber-1].active;
  }


  // Método submitStars
  // Ao terminar de avaliar os itens o usuário pode clicar no boitão de avaliar. Ao fazê-lo, o método passará por cada um dos produtos da ordem e
  // verificará quais estrelas foram atribuídas ao produto e fará o update do ProductOrder correspondente.
  submitStars(order: OrderAndProducts) {
    this.loading = true;
    let newRating = 0;
    let contador = 0;
    for (let i = 0; i < order.products.length; i++) {

      const found = this.ratings.find((rating) => rating.productId === order.products[i].id)
      if (found != null) {
        newRating = found?.stars;
      }

      let updatedOrderProduct: OrderProduct = {
        id: order.orderProducts[i].id,
        orderId: order.orderProducts[i].orderId,
        productId: order.orderProducts[i].productId,
        quantity: order.orderProducts[i].quantity,
        name: order.orderProducts[i].name,
        score: newRating
      }
      this.ordersService.updateOrderProduct(updatedOrderProduct).subscribe(
        (response: OrderProduct) => {
          contador++;

          if (contador === order.products.length) {

            const updateOrder = {
              id: order.order.id,
              userId: order.order.userId,
              value: order.order.value,
              status: order.order.status,
              rated: true
            }

            this.ordersService.updateOrder(updateOrder).subscribe(
              (response: Order) => {
                if(contador === order.products.length){
                  setTimeout(() => {
                    window.location.reload();
                    this.loading = false;
                  }, 2000);
                }
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              }
            );
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  getOrderData(order: OrderAndProducts) {
    return order.order;
  }

  getOrderProductData(order: OrderAndProducts, index: number) {
    return order.orderProducts[index];
  }

  getProductData(order: OrderAndProducts) {
    return order.products
  }
}

interface Star {
  listIndex: number,
  productId: number,
  stars: number,
  starImages: StarImage[]
}

interface StarImage {
  starNumber: number,
  active: boolean
}